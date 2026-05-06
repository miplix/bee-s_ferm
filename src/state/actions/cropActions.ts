import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { CropId } from "../../domain/types/ids";
import { getCropDef, ISLAND_ORDER } from "../../data/crops.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";
import { getCurrentSeason, isCropInSeason } from "../../domain/seasons/seasons";
import { getActiveBoosts } from "../../domain/skills/skillEngine";
import { skillEffectsToBoosts, aggregateBoosts, applyBoostWithSub, applyBoost } from "../../domain/boosts/engine";
import { pollenProratedMultiplier } from "./pollenBoostActions";
import { fertilizerProratedMultiplier } from "./compostActions";

/** Plant a crop on a plot cell. Consumes 1 seed from inventory. */
export function plant(
  state: GameState,
  cx: number,
  cy: number,
  cropId: CropId,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "plot") return state;
  if (cell.cropId) return state;

  const seedId = `${cropId}_seed`;
  const seedCount = state.inventory[seedId] ?? 0;
  if (seedCount < 1) return state;

  const crop = getCropDef(cropId);
  if (getLevel(state.xp) < crop.level) return state;

  // Island check: some crops require a specific island (desert/volcano)
  if (crop.minIsland && ISLAND_ORDER[state.island] < ISLAND_ORDER[crop.minIsland]) return state;

  // Season check: on non-basic islands, seasonal crops can only be planted in their season
  if (state.island !== "basic") {
    const season = getCurrentSeason(now, state.seasonAnchor);
    if (!isCropInSeason(crop.seasons, season)) return state;
  }

  // Compute boosted grow time from skills
  const skillEffects = getActiveBoosts(state.skills);
  const boosts = aggregateBoosts(skillEffectsToBoosts(skillEffects));
  const effectiveGrowMs = Math.round(
    applyBoostWithSub(crop.growMs, "crop_grow", cropId, boosts),
  );

  const cells = { ...state.cells };
  cells[key] = { ...cell, cropId, plantedAt: now, effectiveGrowMs };

  return {
    ...state,
    cells,
    inventory: { ...state.inventory, [seedId]: seedCount - 1 },
    lastMeaningfulActivity: now,
  };
}

/** Harvest a ready crop. Adds produce to inventory. */
export function harvest(
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
  if (elapsed(cell.plantedAt, now) < growMs) return state;

  // Compute boosted harvest yield from skills
  const skillEffects = getActiveBoosts(state.skills);
  const boosts = aggregateBoosts(skillEffectsToBoosts(skillEffects));
  let harvestAmount = applyBoost(crop.harvestCount, "crop_yield", boosts);

  // Fertilizer (sprout_mix) prorated multiplier — same model as pollen boost
  const fertMult = fertilizerProratedMultiplier(
    cell.fertilizerId,
    "yield_mult",
    cell.plantedAt!,
    growMs,
    cell.fertilizedAt,
    cell.fertilizerUntil,
    now,
  );
  harvestAmount = harvestAmount * fertMult;

  // Pollen boost: prorated by fraction of grow time spent under boost
  const pollenMult = pollenProratedMultiplier(
    cell.plantedAt!,
    growMs,
    cell.pollenBoostStartedAt,
    cell.pollenBoostUntil,
    now,
  );
  harvestAmount = harvestAmount * pollenMult;

  // Round so +50% on a single crop visibly produces +1 (1.5 → 2 with random hint).
  // Using floor + chance for the fractional remainder via deterministic seed.
  const fracPart = harvestAmount - Math.floor(harvestAmount);
  let finalAmount = Math.floor(harvestAmount);
  if (fracPart > 0) {
    // deterministic but spread across cells: hash key+plantedAt
    const fracSeed = (cell.plantedAt! ^ key.charCodeAt(0) ^ key.charCodeAt(2)) >>> 0;
    const r = (fracSeed * 9301 + 49297) % 233280 / 233280;
    if (r < fracPart) finalAmount += 1;
  }

  const cells = { ...state.cells };
  const harvestedCropId = cell.cropId;
  cells[key] = {
    ...cell,
    cropId: null,
    plantedAt: null,
    effectiveGrowMs: null,
    fertilizerId: null,
    fertilizedAt: null,
    fertilizerUntil: null,
    // Boost cleared on harvest (each plant is fresh)
    pollenBoostUntil: null,
    pollenBoostStartedAt: null,
  };

  const inv = { ...state.inventory };
  inv[harvestedCropId] = (inv[harvestedCropId] ?? 0) + finalAmount;

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
