import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { CropId } from "../../domain/types/ids";
import { getCropDef } from "../../data/crops.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";
import { getCurrentSeason, isCropInSeason } from "../../domain/seasons/seasons";
import { getActiveBoosts } from "../../domain/skills/skillEngine";
import { skillEffectsToBoosts, aggregateBoosts, applyBoostWithSub, applyBoost } from "../../domain/boosts/engine";
import { mulberry32 } from "../../domain/rng/prng";
import { buildSeed } from "../../domain/rng/seed";
import { rollCropMutant } from "../../domain/mutants/mutants";

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

  // Fertilizer flat bonus (sprout_mix adds +0.2 crop yield)
  if (cell.fertilizerId === "sprout_mix") {
    harvestAmount += 0.2;
  } else if (cell.fertilizerId === "fruitful_blend") {
    harvestAmount += 0.2;
  }

  const finalAmount = Math.floor(harvestAmount);

  const cells = { ...state.cells };
  const harvestedCropId = cell.cropId;
  cells[key] = {
    ...cell,
    cropId: null,
    plantedAt: null,
    effectiveGrowMs: null,
    fertilizerId: null,
  };

  const inv = { ...state.inventory };
  inv[harvestedCropId] = (inv[harvestedCropId] ?? 0) + finalAmount;

  // Mutant roll using seeded PRNG
  const seed = buildSeed(state.seed, now, `mutant:crop:${key}:${now}`);
  const rng = mulberry32(seed);
  const mutant = rollCropMutant(rng, harvestedCropId);
  if (mutant) {
    inv[mutant.mutantId] = (inv[mutant.mutantId] ?? 0) + mutant.bonus;
  }

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
