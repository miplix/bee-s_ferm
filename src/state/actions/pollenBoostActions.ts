import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";

export const POLLEN_BOOST_DURATION_MS = 12 * 3600_000;  // 12 hours
export const POLLEN_BOOST_MULT = 2;                     // x2 yield while active

/** Cost to apply boost per cell type. */
export const POLLEN_COST: Record<string, number> = {
  plot: 1,
  flower_bed: 5,
  fruit_patch: 10,
};

/** Apply pollen boost to a cell. Costs pollen depending on type. */
export function applyPollenBoost(state: GameState, cx: number, cy: number, now: number): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell) return state;
  // resolve to parent for 2x2 (fruit_patch)
  const realKey = cell.parentKey ?? key;
  const realCell = state.cells[realKey];
  if (!realCell) return state;
  const cost = POLLEN_COST[realCell.type];
  if (cost == null) return state; // not boostable
  if ((state.pollen ?? 0) < cost) return state;

  const cells = { ...state.cells };
  cells[realKey] = {
    ...realCell,
    pollenBoostUntil: now + POLLEN_BOOST_DURATION_MS,
    pollenBoostStartedAt: now,
  };

  return {
    ...state,
    pollen: parseFloat(((state.pollen ?? 0) - cost).toFixed(4)),
    cells,
    lastMeaningfulActivity: now,
  };
}

/**
 * Compute yield multiplier based on what fraction of grow time was under boost.
 * yield_final = base * (1 + (boostFraction × (POLLEN_BOOST_MULT - 1)))
 *
 * Example: if 50% of grow time was boosted, and boost gives ×2:
 *   multiplier = 1 + 0.5 × 1 = 1.5
 */
export function pollenProratedMultiplier(
  plantedAt: number,
  growMs: number,
  boostStartedAt: number | null | undefined,
  boostUntil: number | null | undefined,
  harvestTime: number,
): number {
  if (!boostStartedAt || !boostUntil) return 1;
  const totalGrow = Math.min(harvestTime, plantedAt + growMs) - plantedAt;
  if (totalGrow <= 0) return 1;
  const boostStart = Math.max(plantedAt, boostStartedAt);
  const boostEnd = Math.min(plantedAt + growMs, boostUntil, harvestTime);
  const boostedTime = Math.max(0, boostEnd - boostStart);
  const fraction = boostedTime / totalGrow;
  return 1 + fraction * (POLLEN_BOOST_MULT - 1);
}
