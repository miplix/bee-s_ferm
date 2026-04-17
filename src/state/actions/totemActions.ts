/**
 * Actions for activating and managing Time Warp Totems.
 */

import type { GameState, ActiveTotem } from "../../domain/types/game";
import { getTotemDef } from "../../data/collectibles.data";

/**
 * Check if a totem is currently active (not expired).
 */
export function isTotemActive(totem: ActiveTotem | null, now: number): boolean {
  if (!totem) return false;
  return now < totem.activatedAt + totem.durationMs;
}

/**
 * Activate a totem. Consumes from inventory.
 * Mutually exclusive: activating a new totem replaces the current one.
 */
export function activateTotem(
  state: GameState,
  totemId: string,
  now: number,
): GameState {
  const def = getTotemDef(totemId);
  if (!def) return state;

  // Must have the totem in inventory
  const count = state.inventory[totemId] ?? 0;
  if (count < 1) return state;

  const inv = { ...state.inventory };
  inv[totemId] = count - 1;
  if (inv[totemId] <= 0) delete inv[totemId];

  const activeTotem: ActiveTotem = {
    type: totemId,
    activatedAt: now,
    durationMs: def.durationMs,
  };

  return {
    ...state,
    inventory: inv,
    activeTotem,
    lastMeaningfulActivity: now,
  };
}

/**
 * Expire totem if it has run out. Called on tick.
 */
export function expireTotem(
  state: GameState,
  now: number,
): GameState {
  if (!state.activeTotem) return state;
  if (isTotemActive(state.activeTotem, now)) return state;

  return { ...state, activeTotem: null };
}

/**
 * Get the current totem cooldown multiplier (1.0 if none active).
 */
export function getTotemMultiplier(state: GameState, now: number): number {
  if (!state.activeTotem) return 1.0;
  if (!isTotemActive(state.activeTotem, now)) return 1.0;

  const def = getTotemDef(state.activeTotem.type);
  return def ? def.cooldownMult : 1.0;
}
