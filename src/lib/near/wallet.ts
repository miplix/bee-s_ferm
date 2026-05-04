import { NearConnector, NearWalletBase } from "@hot-labs/near-connect";
import SignClient from "@walletconnect/sign-client";

// Public WalletConnect Project ID (used by hot-connector example).
const WC_PROJECT_ID = "1292473190ce7eb75c9de67e15aaad99";

// Treasury account that receives VIP NEAR payments
export const TREASURY_ID = (import.meta.env.VITE_NEAR_TREASURY_ID as string) || "darai_drop.near";

// Pollen FT contract (NEP-141) and recipient
export const POLLEN_TOKEN_CONTRACT = "pollen.tkn.near";
export const POLLEN_RECIPIENT = "darai_drop.near";
export const POLLEN_TOKEN_DECIMALS = parseInt(
  (import.meta.env.VITE_POLLEN_TOKEN_DECIMALS as string) || "18",
  10
);

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

/**
 * Send NEP-141 fungible tokens (pollen.tkn.near) → POLLEN_RECIPIENT.
 * Returns tx hash. Requires 1 yoctoNEAR attached_deposit per NEP-141 standard.
 */
export async function sendPollenToken(amount: number): Promise<string> {
  if (!_account) throw new Error("Кошелёк не подключён");
  const wallet = _wallet ?? await getConnector().wallet();
  if (!wallet) throw new Error("Кошелёк недоступен");

  const tokenAmount = toTokenUnits(amount, POLLEN_TOKEN_DECIMALS);

  const result: any = await wallet.signAndSendTransaction({
    receiverId: POLLEN_TOKEN_CONTRACT,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "ft_transfer",
          args: {
            receiver_id: POLLEN_RECIPIENT,
            amount: tokenAmount,
            memo: "bee-farm pollen topup",
          },
          gas: "30000000000000",  // 30 Tgas
          deposit: "1",            // 1 yoctoNEAR (NEP-141 requirement)
        },
      },
    ],
  } as any);

  const txHash = result?.transaction?.hash || result?.transaction_outcome?.id || "";
  if (!txHash) throw new Error("Транзакция не подтверждена");
  return txHash;
}
