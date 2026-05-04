import { NearConnector, NearWalletBase } from "@hot-labs/near-connect";
import SignClient from "@walletconnect/sign-client";

const NETWORK = (import.meta.env.VITE_NEAR_NETWORK as "mainnet" | "testnet") || "mainnet";
const WALLETCONNECT_PROJECT_ID = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string) || "";

let _connector: NearConnector | null = null;
let _wallet: NearWalletBase | undefined;
let _account: { id: string; network: "mainnet" | "testnet" } | null = null;

const listeners = new Set<(account: typeof _account) => void>();
function emit() { for (const fn of listeners) fn(_account); }

/** Subscribe to wallet account changes. */
export function onAccount(fn: (account: typeof _account) => void): () => void {
  listeners.add(fn);
  fn(_account);
  return () => { listeners.delete(fn); };
}

export function getAccount() { return _account; }

/** Initialize NearConnector singleton. Idempotent. */
export function getConnector(): NearConnector {
  if (_connector) return _connector;

  const walletConnect = WALLETCONNECT_PROJECT_ID
    ? SignClient.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        metadata: {
          name: "Пчело-ферма",
          description: "Bee Farm — NEAR farming game",
          url: typeof window !== "undefined" ? window.location.origin : "",
          icons: ["/icons/coin.png"],
        },
      })
    : undefined;

  _connector = new NearConnector({
    network: NETWORK,
    walletConnect,
    providers: NETWORK === "mainnet"
      ? { mainnet: ["https://relmn.aurora.dev"] }
      : undefined,
  });

  _connector.on("wallet:signIn", async (t: any) => {
    _wallet = await _connector!.wallet();
    const acc = t.accounts?.[0];
    if (acc) {
      _account = { id: acc.accountId, network: acc.accountId.endsWith("testnet") ? "testnet" : "mainnet" };
      emit();
    }
  });

  _connector.on("wallet:signOut", async () => {
    _wallet = undefined;
    _account = null;
    emit();
  });

  return _connector;
}

/** Open wallet selector and connect. */
export async function connectNear(): Promise<void> {
  const c = getConnector();
  await c.connect();
}

/** Disconnect current wallet. */
export async function disconnectNear(): Promise<void> {
  const c = getConnector();
  await c.disconnect();
}

/** Returns true if NEAR wallet integration is enabled (env configured). */
export function isNearEnabled(): boolean {
  return !!WALLETCONNECT_PROJECT_ID;
}
