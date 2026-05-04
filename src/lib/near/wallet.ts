import { NearConnector, NearWalletBase } from "@hot-labs/near-connect";
import SignClient from "@walletconnect/sign-client";

// Public WalletConnect Project ID (used by hot-connector example).
// Можно оставить так — оплата за него не идёт, лимит generous.
// Если будет проблема (rate limit), просто зарегистрируем свой на cloud.reown.com.
const WC_PROJECT_ID = "1292473190ce7eb75c9de67e15aaad99";

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
