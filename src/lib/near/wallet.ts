import { NearConnector, NearWalletBase } from "@hot-labs/near-connect";
import SignClient from "@walletconnect/sign-client";

// Public WalletConnect Project ID (used by hot-connector example).
const WC_PROJECT_ID = "1292473190ce7eb75c9de67e15aaad99";

// Treasury account that receives VIP NEAR payments
export const TREASURY_ID = (import.meta.env.VITE_NEAR_TREASURY_ID as string) || "darai_drop.near";

// Pollen FT contract (NEP-141) and recipient.
// Decimals=0 verified via on-chain ft_metadata: 1 token = 1 base unit (no fractions).
export const POLLEN_TOKEN_CONTRACT = "pollen.tkn.near";
export const POLLEN_RECIPIENT = "darai_drop.near";
export const POLLEN_TOKEN_DECIMALS = 0;

const YOCTO = 10n ** 24n;
function nearToYocto(near: number): string {
  // Use string math to avoid float-precision issues
  const [whole, frac = ""] = near.toFixed(24).split(".");
  const padded = (frac + "0".repeat(24)).slice(0, 24);
  return (BigInt(whole) * YOCTO + BigInt(padded)).toString();
}

let _connector: NearConnector | null = null;
let _wallet: NearWalletBase | undefined;
let _account: { id: string; network: "mainnet" } | null = null;

const listeners = new Set<(account: typeof _account) => void>();
function emit() { for (const fn of listeners) fn(_account); }

/** Subscribe to wallet account changes. */
export function onAccount(fn: (account: typeof _account) => void): () => void {
  listeners.add(fn);
  fn(_account);
  return () => { listeners.delete(fn); };
}

export function getAccount() { return _account; }

/** Initialize NearConnector singleton. Idempotent. Always mainnet. */
export function getConnector(): NearConnector {
  if (_connector) return _connector;

  const walletConnect = SignClient.init({
    projectId: WC_PROJECT_ID,
    metadata: {
      name: "Пчело-ферма",
      description: "Bee Farm — NEAR farming game",
      url: typeof window !== "undefined" ? window.location.origin : "https://bee-s-ferm.vercel.app",
      icons: ["/icons/coin.png"],
    },
  });

  _connector = new NearConnector({
    network: "mainnet",
    walletConnect,
    providers: { mainnet: ["https://relmn.aurora.dev"] },
  });

  _connector.on("wallet:signIn", async (t: any) => {
    _wallet = await _connector!.wallet();
    const acc = t.accounts?.[0];
    if (acc) {
      _account = { id: acc.accountId, network: "mainnet" };
      emit();
    }
  });

  _connector.on("wallet:signOut", async () => {
    _wallet = undefined;
    _account = null;
    emit();
  });

  // Restore previous session on init (auto-connect)
  _connector.wallet().then(async (w) => {
    if (!w) return;
    _wallet = w;
    const accs = await w.getAccounts();
    if (accs && accs.length > 0) {
      _account = { id: accs[0].accountId, network: "mainnet" };
      emit();
    }
  }).catch(() => {});

  return _connector;
}

let _initialized = false;
/** Trigger init (idempotent). Restores session from storage if any. */
export function initNear() {
  if (_initialized) return;
  _initialized = true;
  getConnector();
}

/** Open wallet selector and connect. */
export async function connectNear(): Promise<void> {
  await getConnector().connect();
}

/** Disconnect current wallet. */
export async function disconnectNear(): Promise<void> {
  await getConnector().disconnect();
}

/**
 * Send NEAR from connected account to TREASURY_ID.
 * Returns tx hash on success. Throws if wallet not connected or user rejected.
 */
export async function sendNear(amountNear: number, memo?: string): Promise<string> {
  if (!_account) throw new Error("Кошелёк не подключён");
  const wallet = _wallet ?? await getConnector().wallet();
  if (!wallet) throw new Error("Кошелёк недоступен");

  const yoctoAmount = nearToYocto(amountNear);
  const result: any = await wallet.signAndSendTransaction({
    receiverId: TREASURY_ID,
    actions: [
      {
        type: "Transfer",
        params: { deposit: yoctoAmount },
      },
    ],
  } as any);

  const txHash = result?.transaction?.hash || result?.transaction_outcome?.id || "";
  if (!txHash) throw new Error("Транзакция не подтверждена");
  void memo;
  return txHash;
}

/** Convert human number → token base units string (10^decimals). */
function toTokenUnits(amount: number, decimals: number): string {
  const [whole, frac = ""] = amount.toFixed(decimals).split(".");
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return (BigInt(whole) * (10n ** BigInt(decimals)) + BigInt(padded)).toString();
}

/** Query ft_metadata or any view function via NEAR RPC. */
async function viewFunction(contractId: string, methodName: string, args: object = {}): Promise<any> {
  const argsBase64 = btoa(JSON.stringify(args));
  const res = await fetch("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: "1", method: "query",
      params: {
        request_type: "call_function",
        account_id: contractId,
        method_name: methodName,
        args_base64: argsBase64,
        finality: "final",
      },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const bytes = data.result?.result ?? [];
  const text = new TextDecoder().decode(new Uint8Array(bytes));
  return text ? JSON.parse(text) : null;
}

/** Check if account is registered with the FT contract (NEP-145 storage). */
async function isStorageRegistered(contractId: string, accountId: string): Promise<boolean> {
  try {
    const balance = await viewFunction(contractId, "storage_balance_of", { account_id: accountId });
    return balance != null;
  } catch {
    return false;
  }
}

/**
 * Send NEP-141 fungible tokens (pollen.tkn.near) → POLLEN_RECIPIENT.
 * Auto-registers sender storage on the FT contract if not yet (NEP-145).
 * Returns tx hash.
 */
export async function sendPollenToken(amount: number): Promise<string> {
  if (!_account) throw new Error("Кошелёк не подключён");
  const wallet = _wallet ?? await getConnector().wallet();
  if (!wallet) throw new Error("Кошелёк недоступен");

  const tokenAmount = toTokenUnits(amount, POLLEN_TOKEN_DECIMALS);

  // Check if sender is registered with the FT contract; if not — batch storage_deposit
  const senderRegistered = await isStorageRegistered(POLLEN_TOKEN_CONTRACT, _account.id);
  const recipientRegistered = await isStorageRegistered(POLLEN_TOKEN_CONTRACT, POLLEN_RECIPIENT);

  const actions: any[] = [];
  if (!senderRegistered) {
    actions.push({
      type: "FunctionCall",
      params: {
        methodName: "storage_deposit",
        args: { account_id: _account.id, registration_only: true },
        gas: "30000000000000",
        deposit: "1250000000000000000000",  // 0.00125 NEAR (standard NEP-145 min)
      },
    });
  }
  if (!recipientRegistered) {
    actions.push({
      type: "FunctionCall",
      params: {
        methodName: "storage_deposit",
        args: { account_id: POLLEN_RECIPIENT, registration_only: true },
        gas: "30000000000000",
        deposit: "1250000000000000000000",
      },
    });
  }
  actions.push({
    type: "FunctionCall",
    params: {
      methodName: "ft_transfer",
      args: {
        receiver_id: POLLEN_RECIPIENT,
        amount: tokenAmount,
        memo: "bee-farm pollen topup",
      },
      gas: "30000000000000",
      deposit: "1",   // 1 yoctoNEAR (NEP-141)
    },
  });

  const result: any = await wallet.signAndSendTransaction({
    receiverId: POLLEN_TOKEN_CONTRACT,
    actions,
  } as any);

  const txHash = result?.transaction?.hash || result?.transaction_outcome?.id || "";
  if (!txHash) throw new Error("Транзакция не подтверждена");
  return txHash;
}

/**
 * Withdraw pollen from in-game balance to player's NEAR wallet (calls ft_transfer FROM treasury).
 * NOTE: This requires the treasury account to sign tx — needs server-side relayer.
 * For now stub: marks intent, server processes async. Returns request id.
 */
export async function requestPollenWithdraw(amount: number, vipActive: boolean): Promise<{ amountToReceive: number; fee: number }> {
  if (!_account) throw new Error("Кошелёк не подключён");
  const feePct = vipActive ? 0.05 : 0.25;
  const fee = Math.floor(amount * feePct);
  const amountToReceive = amount - fee;
  // TODO: persist request to Supabase, relayer will pick it up and ft_transfer from treasury.
  return { amountToReceive, fee };
}
