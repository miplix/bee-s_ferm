import type { GameState } from "../../domain/types/game";

/**
 * Credit in-game pollen 1:1 from pollen.tkn.near token transfer.
 * txHash must be unique (replay-guard).
 */
export function creditPollen(state: GameState, amountTokens: number, txHash: string): GameState {
  const processed = state.processedTxHashes ?? [];
  if (processed.includes(txHash)) return state;

  return {
    ...state,
    pollen: parseFloat(((state.pollen ?? 0) + amountTokens).toFixed(4)),
    processedTxHashes: [...processed, txHash].slice(-200),
    lastMeaningfulActivity: Date.now(),
  };
}

/** Activate/extend VIP. months × 30 days added to current expiresAt (or now if expired). */
export function activateVip(state: GameState, months: number, txHash: string, now: number): GameState {
  const processed = state.processedTxHashes ?? [];
  if (processed.includes(txHash)) return state;

  const current = state.vipExpiresAt && state.vipExpiresAt > now ? state.vipExpiresAt : now;
  const extension = months * 30 * 24 * 3600_000;

  return {
    ...state,
    vipExpiresAt: current + extension,
    processedTxHashes: [...processed, txHash].slice(-200),
    lastMeaningfulActivity: now,
  };
}

export function isVipActive(state: GameState, now: number): boolean {
  return !!(state.vipExpiresAt && state.vipExpiresAt > now);
}

/** VIP pricing: 1 NEAR = 1 month VIP. Adjustable. */
export const VIP_PRICE_NEAR_PER_MONTH = 1;
