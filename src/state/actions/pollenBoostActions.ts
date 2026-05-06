import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";

export const POLLEN_BOOST_MULT = 2;                     // ×2 yield on next harvest

/** Cost to apply boost per cell type. */
export const POLLEN_COST: Record<string, number> = {
  plot: 1,
  flower_bed: 5,
  fruit_patch: 10,
};

/**
 * Apply pollen boost to a cell.
 * 1 пыльца = ×2 урожай на следующий сбор. Эффект **фиксированный** —
 * не зависит от того когда применили (до посадки или после). Снимается на сборе.
 */
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

  // Already boosted — don't double-charge
  if (realCell.pollenBoostUntil && realCell.pollenBoostUntil > now) return state;

  const cells = { ...state.cells };
  // Sentinel "until" — far future timestamp; boost holds until consumed at harvest
  cells[realKey] = {
    ...realCell,
    pollenBoostUntil: Number.MAX_SAFE_INTEGER,
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
 * Multiplier applied at harvest. Fixed ×POLLEN_BOOST_MULT if boost is active.
 * Boost is single-use — каждый вызов harvest{Crop,Fruit,Flower} должен очищать
 * pollenBoostUntil/pollenBoostStartedAt.
 *
 * The signature keeps legacy params (plantedAt/growMs/etc.) for compatibility
 * but they are unused — multiplier is fixed.
 */
export function pollenProratedMultiplier(
  _plantedAt: number,
  _growMs: number,
  boostStartedAt: number | null | undefined,
  boostUntil: number | null | undefined,
  now: number,
): number {
  if (!boostStartedAt || !boostUntil) return 1;
  if (boostUntil <= now) return 1;
  return POLLEN_BOOST_MULT;
}
