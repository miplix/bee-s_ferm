/**
 * Pure boost engine — aggregates effects and applies them to base values.
 * No side effects, fully testable.
 */

import type { BoostEffect as SkillBoostEffect } from "../../data/skills.data";
import { getCollectibleDef, type CollectibleBoost } from "../../data/collectibles.data";
import { getFactionDef } from "../../data/factions.data";
// pets removed

// ── Types ──

export interface BoostEffect {
  type: "flat" | "mult";
  target: string;       // what it affects: "crop_grow", "crop_yield", "wood", "stone", etc.
  value: number;        // +0.1, -0.05 (for -5%), etc.
}

export interface AggregatedBoost {
  flat: number;
  mult: number;
}

// ── Skill effect -> BoostEffect mapping ──

/**
 * Convert skill engine effects (BoostEffectType) into generic BoostEffects.
 * This bridges the skill system with the boost engine.
 */
export function skillEffectsToBoosts(effects: SkillBoostEffect[]): BoostEffect[] {
  const boosts: BoostEffect[] = [];
  for (const e of effects) {
    switch (e.type) {
      case "cropGrowTime":
        boosts.push({ type: "mult", target: "crop_grow", value: e.value });
        break;
      case "cropYield":
        boosts.push({ type: "flat", target: "crop_yield", value: e.value });
        break;
      case "specificCropGrow":
        // target-specific crop grow time (uses crop id as sub-target)
        if (e.target) {
          boosts.push({ type: "mult", target: `crop_grow:${e.target}`, value: e.value });
        } else {
          boosts.push({ type: "mult", target: "crop_grow", value: e.value });
        }
        break;
      case "woodYield":
        boosts.push({ type: "flat", target: "wood", value: e.value });
        break;
      case "woodPercent":
        boosts.push({ type: "mult", target: "wood", value: e.value });
        break;
      case "stoneYield":
        boosts.push({ type: "flat", target: "stone", value: e.value });
        break;
      case "ironYield":
        boosts.push({ type: "flat", target: "iron", value: e.value });
        break;
      case "goldYield":
        boosts.push({ type: "flat", target: "gold", value: e.value });
        break;
      case "allOreYield":
        boosts.push({ type: "flat", target: "stone", value: e.value });
        boosts.push({ type: "flat", target: "iron", value: e.value });
        boosts.push({ type: "flat", target: "gold", value: e.value });
        break;
      case "miningCooldown":
        boosts.push({ type: "mult", target: "mining_cooldown", value: e.value });
        break;
      case "treeCooldown":
        boosts.push({ type: "mult", target: "tree_cooldown", value: e.value });
        break;
      case "chopAnimation":
        boosts.push({ type: "flat", target: "chop_animation", value: e.value });
        break;
      case "eggProduction":
        boosts.push({ type: "mult", target: "animal_products:egg", value: e.value });
        break;
      case "milkProduction":
        boosts.push({ type: "mult", target: "animal_products:milk", value: e.value });
        break;
      case "allAnimalProducts":
        boosts.push({ type: "mult", target: "animal_products", value: e.value });
        break;
      case "feedCost":
        boosts.push({ type: "mult", target: "feed_cost", value: e.value });
        break;
    }
  }
  return boosts;
}

// ── Aggregation ──

/**
 * Aggregate multiple boost effects by target.
 * flat bonuses are summed; mult bonuses are summed then added to 1.0.
 * e.g. two mult effects of -0.05 and -0.10 => mult = 1 + (-0.05) + (-0.10) = 0.85
 */
export function aggregateBoosts(
  effects: BoostEffect[],
): Record<string, AggregatedBoost> {
  const map: Record<string, AggregatedBoost> = {};

  for (const e of effects) {
    if (!map[e.target]) {
      map[e.target] = { flat: 0, mult: 1 };
    }
    if (e.type === "flat") {
      map[e.target].flat += e.value;
    } else {
      // mult values are additive offsets to 1.0 (e.g. -0.05 means 95%)
      map[e.target].mult += e.value;
    }
  }

  return map;
}

// ── Application ──

/**
 * Apply aggregated boosts to a base value.
 * Formula: (base + flat) * mult
 * Returns at least 0 (no negative values).
 */
export function applyBoost(
  base: number,
  target: string,
  boosts: Record<string, AggregatedBoost>,
): number {
  const b = boosts[target];
  if (!b) return base;
  return Math.max(0, (base + b.flat) * b.mult);
}

/**
 * Apply boosts with sub-target fallback.
 * e.g. for "crop_grow:sunflower", first applies "crop_grow" then "crop_grow:sunflower".
 */
export function applyBoostWithSub(
  base: number,
  target: string,
  subTarget: string | null,
  boosts: Record<string, AggregatedBoost>,
): number {
  let result = applyBoost(base, target, boosts);
  if (subTarget) {
    result = applyBoost(result, `${target}:${subTarget}`, boosts);
  }
  return result;
}

// ── Collectible boosts ──

/**
 * Convert placed collectibles into generic BoostEffects.
 */
export function collectibleBoostsToEffects(
  collectibleIds: string[],
): BoostEffect[] {
  const effects: BoostEffect[] = [];
  for (const id of collectibleIds) {
    const def = getCollectibleDef(id);
    if (!def) continue;
    for (const b of def.boosts) {
      effects.push({ type: b.type, target: b.target, value: b.value });
    }
  }
  return effects;
}

// ── Totem boosts ──

/**
 * Generate boost effects for an active totem.
 * Totem applies a multiplicative reduction to all timer-based targets.
 */
export function totemToBoostEffects(
  totemMult: number,
): BoostEffect[] {
  if (totemMult >= 1.0) return [];

  // The totem multiplier (e.g. 0.5) means timers run at 50%.
  // As a mult boost: value = mult - 1.0 = -0.5 (i.e. -50%)
  const value = totemMult - 1.0;

  return [
    { type: "mult", target: "crop_grow", value },
    { type: "mult", target: "cooking_time", value },
    { type: "mult", target: "mining_cooldown", value },
    { type: "mult", target: "tree_cooldown", value },
    { type: "mult", target: "expansion_time", value },
  ];
}

// ── Faction boosts ──

/**
 * Convert a faction membership into generic BoostEffects.
 * The Nightshade faction applies its cooldown reduction to all timer targets.
 */
export function factionToBoostEffects(factionId: string | null): BoostEffect[] {
  if (!factionId) return [];
  const def = getFactionDef(factionId);
  if (!def) return [];

  // Nightshade's "all_cooldowns" target fans out to all timer targets
  if (def.boost.target === "all_cooldowns") {
    const value = def.boost.value;
    return [
      { type: "mult", target: "crop_grow", value },
      { type: "mult", target: "cooking_time", value },
      { type: "mult", target: "mining_cooldown", value },
      { type: "mult", target: "tree_cooldown", value },
      { type: "mult", target: "expansion_time", value },
      { type: "mult", target: "animal_sleep", value },
    ];
  }

  // Goblin's "resource_yield" fans out to all resource types
  if (def.boost.target === "resource_yield") {
    const value = def.boost.value;
    return [
      { type: "mult", target: "wood", value },
      { type: "mult", target: "stone", value },
      { type: "mult", target: "iron", value },
      { type: "mult", target: "gold", value },
    ];
  }

  return [{ type: def.boost.type, target: def.boost.target, value: def.boost.value }];
}

// ── Pet boosts ──

/** Pets removed — stub returns empty effects. */
export function petBoostsToEffects(_petIds: string[]): BoostEffect[] {
  return [];
}

// ── Combined boost aggregation ──

/**
 * Build a complete aggregated boost map from skills, collectibles, totem, faction, and pets.
 */
export function getAllBoosts(
  skillEffects: SkillBoostEffect[],
  collectibleIds: string[],
  totemMult: number,
  factionId?: string | null,
  petIds?: string[],
): Record<string, AggregatedBoost> {
  const effects: BoostEffect[] = [
    ...skillEffectsToBoosts(skillEffects),
    ...collectibleBoostsToEffects(collectibleIds),
    ...totemToBoostEffects(totemMult),
    ...factionToBoostEffects(factionId ?? null),
    ...petBoostsToEffects(petIds ?? []),
  ];
  return aggregateBoosts(effects);
}
