import { log } from "../log";

/**
 * NEAR Wallet Stub — placeholder for Etap 8.
 * Real implementation will use near-api-js.
 */

export interface WalletState {
  connected: boolean;
  accountId: string | null;
  balance: number;
}

const stubState: WalletState = {
  connected: false,
  accountId: null,
  balance: 0,
};

export async function connectWallet(): Promise<WalletState> {
  log.debug("[NEAR Stub] Connect wallet — not implemented yet");
  return stubState;
}

export async function disconnectWallet(): Promise<void> {
  log.debug("[NEAR Stub] Disconnect wallet — not implemented yet");
}

export async function withdrawPollen(_amount: number): Promise<{ success: boolean; txHash?: string }> {
  log.debug("[NEAR Stub] Withdraw pollen — not implemented yet");
  return { success: false };
}

export async function depositPollen(_amount: number): Promise<{ success: boolean; txHash?: string }> {
  log.debug("[NEAR Stub] Deposit pollen — not implemented yet");
  return { success: false };
}

export function getWalletState(): WalletState {
  return { ...stubState };
}
