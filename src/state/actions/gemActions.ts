/**
 * Gem-powered actions: speed-ups, omnifeed, shop restock.
 */

import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { getCropDef } from "../../data/crops.data";
import { getSpeedUpCost, OMNIFEED_GEM_COST, RESTOCK_SHOP_GEM_COST } from "../../data/gems.data";
import { getToday, getWeekStart } from "../../data/shopLimits.data";

// ── Helpers ──

function deductGems(state: GameState, cost: number): GameState | null {
  if (state.gems < cost) return null;
  return { ...state, gems: state.gems - cost };
}

// ── Speed-up Crop ──

/**
 * Instantly finish crop growth. Cost based on remaining time.
 */
export function speedUpCrop(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "plot" || !cell.cropId || !cell.plantedAt) return state;

  const crop = getCropDef(cell.cropId);
  const growMs = cell.effectiveGrowMs ?? crop.growMs;
  const elapsed = now - cell.plantedAt;
  const remaining = growMs - elapsed;

  if (remaining <= 0) return state; // already done

  const cost = getSpeedUpCost(remaining);
  const afterGems = deductGems(state, cost);
  if (!afterGems) return state;

  // Set plantedAt far enough in the past so the crop is ready now
  const cells = { ...afterGems.cells };
  cells[key] = { ...cell, plantedAt: now - growMs };

  return {
    ...afterGems,
    cells,
    lastMeaningfulActivity: now,
  };
}

// ── Speed-up Cooking ──

/**
 * Instantly finish a cooking slot. Cost based on remaining time.
 */
export function speedUpCooking(
  state: GameState,
  slotIndex: number,
  now: number,
): GameState {
  const slot = state.cookingSlots[slotIndex];
  if (!slot) return state;

  const elapsed = now - slot.startedAt;
  const remaining = slot.durationMs - elapsed;

  if (remaining <= 0) return state; // already done

  const cost = getSpeedUpCost(remaining);
  const afterGems = deductGems(state, cost);
  if (!afterGems) return state;

  // Set startedAt far enough in the past so the slot is done now
  const cookingSlots = [...afterGems.cookingSlots];
  cookingSlots[slotIndex] = {
    ...slot,
    startedAt: now - slot.durationMs,
  };

  return {
    ...afterGems,
    cookingSlots,
    lastMeaningfulActivity: now,
  };
}

// ── Speed-up Expansion ──

/**
 * Instantly finish pending expansion. Cost based on remaining time.
 */
export function speedUpExpansion(
  state: GameState,
  now: number,
): GameState {
  const pending = state.pendingExpansion;
  if (!pending) return state;

  const elapsed = now - pending.startedAt;
  const remaining = pending.durationMs - elapsed;

  if (remaining <= 0) return state; // already done

  const cost = getSpeedUpCost(remaining);
  const afterGems = deductGems(state, cost);
  if (!afterGems) return state;

  // Set startedAt far enough in the past so it's done now
  return {
    ...afterGems,
    pendingExpansion: {
      ...pending,
      startedAt: now - pending.durationMs,
    },
    lastMeaningfulActivity: now,
  };
}

// ── Omnifeed ──

/**
 * Buy omnifeed items (1 gem each). Adds "omnifeed" to inventory.
 */
export function buyOmnifeed(
  state: GameState,
  qty: number,
): GameState {
  if (qty <= 0) return state;
  const cost = OMNIFEED_GEM_COST * qty;
  const afterGems = deductGems(state, cost);
  if (!afterGems) return state;

  const inv = { ...afterGems.inventory };
  inv.omnifeed = (inv.omnifeed ?? 0) + qty;

  return { ...afterGems, inventory: inv };
}

// ── Restock Shop ──

/**
 * Restock daily shop limits for 20 gems. Resets all daily purchase counts.
 */
export function restockShop(
  state: GameState,
  now: number,
): GameState {
  const cost = RESTOCK_SHOP_GEM_COST;
  const afterGems = deductGems(state, cost);
  if (!afterGems) return state;

  // Reset all daily counters by clearing lastDay to force fresh counts
  const shopPurchases = { ...afterGems.shopPurchases };
  const today = getToday(now);
  const weekStart = getWeekStart(now);

  for (const key of Object.keys(shopPurchases)) {
    shopPurchases[key] = {
      ...shopPurchases[key],
      daily: 0,
      lastDay: today,
      // Keep weekly intact
      weekly: shopPurchases[key].lastWeek === weekStart ? shopPurchases[key].weekly : 0,
      lastWeek: shopPurchases[key].lastWeek || weekStart,
    };
  }

  return {
    ...afterGems,
    shopPurchases,
    lastMeaningfulActivity: now,
  };
}
