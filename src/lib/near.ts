"use client";

let selector: any = null;
let selectorUI: any = null;
let signInResolve: ((id: string | null) => void) | null = null;

async function init() {
  if (selector) return;

  const { WalletSelector, WalletSelectorUI } = await import("@hot-labs/near-connect");
  const { SignClient } = await import("@walletconnect/sign-client");

  const walletConnect = SignClient.init({
    projectId: "1292473190ce7eb75c9de67e15aaad99",
    metadata: {
      name: "NEAR Farm",
      description: "2D farming game on NEAR",
      url: typeof window !== "undefined" ? window.location.origin : "",
      icons: [],
    },
  });

  selector = new WalletSelector({
    network: "mainnet",
    footerBranding: null,
    walletConnect,
  } as any);

  selectorUI = new WalletSelectorUI(selector);

  selector.on("wallet:signIn", (t: any) => {
    const accountId = t.accounts?.[0]?.accountId ?? null;
    if (accountId) localStorage.setItem("nearAccountId", accountId);
    if (signInResolve) { signInResolve(accountId); signInResolve = null; }
  });
}

export async function tryRestoreSession(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nearAccountId");
}

export async function connectWallet(): Promise<string | null> {
  await init();
  return new Promise((resolve) => {
    signInResolve = resolve;
    selectorUI?.open();
  });
}

export async function disconnectWallet(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nearAccountId");
  try {
    await init();
    await selector?.disconnect();
  } catch {}
}
