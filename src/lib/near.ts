"use client";

declare global {
  interface Window {
    NearConnectLib?: { NearConnector: new (opts?: any) => any };
    _nearConnector?: any;
  }
}

let connector: any = null;
let signInResolve: ((id: string | null) => void) | null = null;

async function getConnector() {
  if (connector) return connector;
  if (typeof window === "undefined") return null;

  // Wait for bundle to load
  const lib = window.NearConnectLib;
  if (!lib?.NearConnector) {
    console.error("NearConnectLib not loaded");
    return null;
  }

  // Load WalletConnect SignClient for full wallet support
  let walletConnect: any = undefined;
  try {
    const { SignClient } = await import("@walletconnect/sign-client");
    walletConnect = SignClient.init({
      projectId: "1292473190ce7eb75c9de67e15aaad99",
      metadata: {
        name: "NEAR Farm",
        description: "2D farming game on NEAR",
        url: window.location.origin,
        icons: [],
      },
    });
  } catch (e) {
    console.warn("WalletConnect init failed, some wallets may not work:", e);
  }

  connector = new lib.NearConnector({
    network: "mainnet",
    footerBranding: null,
    walletConnect,
  });
  window._nearConnector = connector;

  // Single global signIn handler
  connector.on("wallet:signIn", (t: any) => {
    const accountId = t.accounts?.[0]?.accountId ?? null;
    if (accountId) localStorage.setItem("nearAccountId", accountId);
    if (signInResolve) { signInResolve(accountId); signInResolve = null; }
  });

  return connector;
}

export async function tryRestoreSession(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nearAccountId");
}

export async function connectWallet(): Promise<string | null> {
  const c = await getConnector();
  if (!c) return null;
  return new Promise((resolve) => {
    signInResolve = resolve;
    // Do NOT await — opens modal, result via event
    c.connect().catch(() => {});
  });
}

export async function disconnectWallet(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nearAccountId");
  try {
    const c = await getConnector();
    const wallet = await c?.wallet();
    if (wallet) await wallet.signOut();
  } catch {}
  connector = null;
  window._nearConnector = undefined;
}
