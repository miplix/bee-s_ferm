"use client";

import { WalletSelector, WalletSelectorUI } from "@hot-labs/near-connect";

let selector: WalletSelector | null = null;
let selectorUI: WalletSelectorUI | null = null;

function getSelector(): WalletSelector {
  if (!selector) {
    selector = new WalletSelector({
      network: (process.env.NEXT_PUBLIC_NEAR_NETWORK as "mainnet" | "testnet") || "mainnet",
    });
    selectorUI = new WalletSelectorUI(selector);
  }
  return selector;
}

export async function connectWallet(): Promise<string | null> {
  const s = getSelector();

  return new Promise((resolve) => {
    s.on("wallet:signIn", async ({ accounts, success }) => {
      if (success && accounts.length > 0) {
        resolve(accounts[0].accountId);
      } else {
        resolve(null);
      }
    });

    // Open the wallet selector UI modal
    selectorUI?.open();
  });
}

export async function disconnectWallet(): Promise<void> {
  const s = getSelector();
  try {
    await s.disconnect();
  } catch {
    // already disconnected
  }
}

export async function getAccountId(): Promise<string | null> {
  const s = getSelector();
  try {
    const { accounts } = await s.getConnectedWallet();
    return accounts[0]?.accountId ?? null;
  } catch {
    return null;
  }
}
