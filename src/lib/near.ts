"use client";

// We use the near-connect bundle loaded via <script> tag (same as 2048 project)
// It exposes window.NearConnectLib with NearConnector class

declare global {
  interface Window {
    NearConnectLib?: {
      NearConnector: new (options?: any) => any;
    };
    _nearConnector?: any;
  }
}

let connector: any = null;

function getConnector(): any {
  if (connector) return connector;

  const lib = window.NearConnectLib;
  if (!lib || !lib.NearConnector) {
    console.error("NearConnectLib not loaded. Check that near-connect.bundle.js is included.");
    return null;
  }

  try {
    connector = new lib.NearConnector({
      network: "mainnet",
      footerBranding: null,
    });
    window._nearConnector = connector;
  } catch (e) {
    console.error("NearConnector init error", e);
    return null;
  }

  return connector;
}

// Try to restore existing wallet session
export async function tryRestoreSession(): Promise<string | null> {
  // Check localStorage first (fast path)
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("nearAccountId");
  if (saved) return saved;
  return null;
}

export function connectWallet(): Promise<string | null> {
  return new Promise((resolve) => {
    const c = getConnector();
    if (!c) {
      resolve(null);
      return;
    }

    // Listen for signIn — same pattern as working 2048 project
    c.on("wallet:signIn", (t: any) => {
      const accountId = t.accounts?.[0]?.accountId ?? null;
      if (accountId) {
        localStorage.setItem("nearAccountId", accountId);
      }
      resolve(accountId);
    });

    // Do NOT await — connect() just opens the wallet selector modal
    // Result comes through the event above
    c.connect().catch(() => {});
  });
}

export async function disconnectWallet(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nearAccountId");

  const c = getConnector();
  if (!c) return;

  try {
    const wallet = await c.wallet();
    if (wallet) {
      await wallet.signOut();
    }
  } catch {
    // already disconnected
  }
  connector = null;
  window._nearConnector = undefined;
}

export async function getAccountId(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nearAccountId");
}
