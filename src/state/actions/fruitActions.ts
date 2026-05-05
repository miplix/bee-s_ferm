import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { FruitId } from "../../domain/types/ids";
import { getFruitDef } from "../../data/fruits.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";
import { pollenProratedMultiplier } from "./pollenBoostActions";
import { fertilizerProratedMultiplier } from "./compostActions";
import { mulberry32, randInt } from "../../domain/rng/prng";

/**
 * Derive a numeric seed from the game seed + cell coordinates.
 * Used to deterministically compute harvestsLeft at plant time.
 */
function cellSeed(gameSeed: string, cx: number, cy: number, now: number): number {
  let h = 0;
  const s = `${gameSeed}:${cx}:${cy}:${now}`;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** Plant a fruit bush on a fruit_patch cell. Consumes 1 fruit seed. */
export function plantFruit(
  state: GameState,
  cx: number,
  cy: number,
  fruitId: FruitId,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "fruit_patch") return state;
  if (cell.fruitId) return state;

  const seedId = `${fruitId}_seed`;
  const seedCount = state.inventory[seedId] ?? 0;
  if (seedCount < 1) return state;

  const fruit = getFruitDef(fruitId);
  if (getLevel(state.xp) < fruit.level) return state;

  // Seeded PRNG determines harvest count
  const rng = mulberry32(cellSeed(state.seed, cx, cy, now));
  const harvestsLeft = randInt(rng, fruit.minHarvests, fruit.maxHarvests);

  const cells = { ...state.cells };
  cells[key] = {
    ...cell,
    fruitId,
    fruitPlantedAt: now,
    fruitHarvestsLeft: harvestsLeft,
    lastFruitHarvest: null,
  };

  return {
    ...state,
    cells,
    inventory: { ...state.inventory, [seedId]: seedCount - 1 },
    lastMeaningfulActivity: now,
  };
}

/** Harvest one fruit from a fruit bush. Decrements harvestsLeft; removes bush when 0. */
export function harvestFruit(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "fruit_patch" || !cell.fruitId || !cell.fruitPlantedAt) return state;

  const fruit = getFruitDef(cell.fruitId);

  // Check grow time: first harvest uses fruitPlantedAt, subsequent uses lastFruitHarvest
  const refTime = cell.lastFruitHarvest ?? cell.fruitPlantedAt;
  if (elapsed(refTime, now) < fruit.growMs) return state;

  const harvestsLeft = (cell.fruitHarvestsLeft ?? 1) - 1;

  const cells = { ...state.cells };
  const inv = { ...state.inventory };
  // Pollen boost prorated for this harvest cycle (refTime → now)
  const pollenMult = pollenProratedMultiplier(
    refTime,
    fruit.growMs,
    cell.pollenBoostStartedAt,
    cell.pollenBoostUntil,
    now,
  );
  // Fertilizer (fruitful_blend) prorated for this harvest cycle (refTime → now)
  const fertMult = fertilizerProratedMultiplier(
    cell.fertilizerId,
    "fruit_yield_mult",
    refTime,
    fruit.growMs,
    cell.fertilizedAt,
    cell.fertilizerUntil,
    now,
  );
  const rawYield = 1 * pollenMult * fertMult;
  // Stochastic rounding for fractional yield (fruit base = 1)
  let yieldAmount = Math.floor(rawYield);
  const frac = rawYield - yieldAmount;
  if (frac > 0) {
    const seed = (refTime ^ key.charCodeAt(0)) >>> 0;
    const r = (seed * 9301 + 49297) % 233280 / 233280;
    if (r < frac) yieldAmount += 1;
  }
  inv[cell.fruitId] = (inv[cell.fruitId] ?? 0) + yieldAmount;

  // Fertilizer expires when its timer ends — clear if past expiry
  const fertExpired = (cell.fertilizerUntil ?? 0) > 0 && (cell.fertilizerUntil ?? 0) <= now;
  const clearedFert = fertExpired
    ? { fertilizerId: null, fertilizedAt: null, fertilizerUntil: null }
    : {};

  if (harvestsLeft <= 0) {
    // Bush depleted — leave as stump until player cuts it (cutSapling)
    cells[key] = {
      ...cell,
      fruitId: null,
      fruitPlantedAt: null,
      fruitHarvestsLeft: 0,            // 0 = stump, awaits cut
      lastFruitHarvest: null,
      fertilizerId: null,
      fertilizedAt: null,
      fertilizerUntil: null,
    };
  } else {
    // Bush still has harvests remaining (fertilizer may persist if still active)
    cells[key] = {
      ...cell,
      fruitHarvestsLeft: harvestsLeft,
      lastFruitHarvest: now,
      ...clearedFert,
    };
  }

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}

/**
 * Cut a depleted fruit-tree stump (harvestsLeft === 0). Requires 1 axe.
 * Does NOT drop wood — just clears the patch for replanting.
 */
export function cutSapling(state: GameState, cx: number, cy: number, now: number): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "fruit_patch") return state;
  if (cell.fruitHarvestsLeft !== 0 || cell.fruitId) return state; // not a stump

  const axes = state.inventory.axe ?? 0;
  if (axes < 1) return state;

  const inv = { ...state.inventory };
  inv.axe = axes - 1;
  if (inv.axe! <= 0) delete inv.axe;

  const cells = { ...state.cells };
  cells[key] = { ...cell, fruitHarvestsLeft: null };

  return { ...state, cells, inventory: inv, lastMeaningfulActivity: now };
}
