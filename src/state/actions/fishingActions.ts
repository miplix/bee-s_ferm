import type { GameState } from "../../domain/types/game";
import { getLevel } from "../../domain/level/level";
import { mulberry32, pick } from "../../domain/rng/prng";
import { buildSeed, dayBucket } from "../../domain/rng/seed";
import {
  FISH, BAITS, DAILY_CAST_LIMIT,
  RARITY_WEIGHTS,
  type FishDef, type FishRarity,
} from "../../data/fishing.data";

// --- Helpers ---

function todayISO(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Auto-reset daily casts if a new day has started. */
export function resetDailyFishing(state: GameState, now: number): GameState {
  const today = todayISO(now);
  if (state.fishingState.lastResetDay === today) return state;

  return {
    ...state,
    fishingState: {
      castsToday: 0,
      lastResetDay: today,
    },
  };
}

/**
 * Determine which fish is caught using seeded PRNG.
 * Steps:
 * 1. Filter fish by player level
 * 2. Group by rarity tier
 * 3. Roll rarity tier first (common 60%, uncommon 25%, rare 15%)
 * 4. Pick uniformly within the tier
 * If a tier has no eligible fish, its weight is redistributed.
 */
function determineCatch(
  seed: number,
  playerLevel: number,
): FishDef {
  const rng = mulberry32(seed);
  const eligible = FISH.filter((f) => f.minLevel <= playerLevel);

  // Group by rarity
  const byRarity: Partial<Record<FishRarity, FishDef[]>> = {};
  for (const f of eligible) {
    (byRarity[f.rarity] ??= []).push(f);
  }

  // Build weighted tiers (skip empty tiers, redistribute weight)
  const tiers: { rarity: FishRarity; weight: number; fish: FishDef[] }[] = [];
  let totalWeight = 0;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS) as [FishRarity, number][]) {
    const pool = byRarity[rarity];
    if (pool && pool.length > 0) {
      tiers.push({ rarity, weight, fish: pool });
      totalWeight += weight;
    }
  }

  // Roll rarity
  let roll = rng() * totalWeight;
  let chosen = tiers[0].fish;
  for (const tier of tiers) {
    roll -= tier.weight;
    if (roll <= 0) {
      chosen = tier.fish;
      break;
    }
  }

  return pick(rng, chosen);
}

// --- Main action ---

/**
 * Cast a fishing line. Consumes 1 bait, checks daily limit,
 * requires fishing_rod in inventory. Returns caught fish in inventory + XP.
 */
export function castLine(
  state: GameState,
  baitId: string,
  now: number,
): GameState {
  // Auto-reset daily casts
  state = resetDailyFishing(state, now);

  // Validate bait exists
  const baitDef = BAITS.find((b) => b.id === baitId);
  if (!baitDef) return state;

  // Check daily limit
  if (state.fishingState.castsToday >= DAILY_CAST_LIMIT) return state;

  // Check bait in inventory
  const baitCount = state.inventory[baitId] ?? 0;
  if (baitCount < 1) return state;

  // Check fishing rod
  const rodCount = state.inventory["fishing_rod"] ?? 0;
  if (rodCount < 1) return state;

  const playerLevel = getLevel(state.xp);
  const castIndex = state.fishingState.castsToday;
  const seed = buildSeed(state.seed, dayBucket(now), `fish:${castIndex}`);
  const caught = determineCatch(seed, playerLevel);

  const inv = { ...state.inventory };

  // Consume 1 bait
  inv[baitId] = baitCount - 1;
  if (inv[baitId]! <= 0) delete inv[baitId];

  // Add caught fish
  inv[caught.id] = (inv[caught.id] ?? 0) + 1;

  return {
    ...state,
    inventory: inv,
    xp: state.xp + caught.xp,
    fishingState: {
      ...state.fishingState,
      castsToday: state.fishingState.castsToday + 1,
    },
    lastMeaningfulActivity: now,
  };
}

/** Buy bait from the fishing panel. */
export function buyBait(
  state: GameState,
  baitId: string,
  qty: number,
): GameState {
  if (qty <= 0) return state;
  const baitDef = BAITS.find((b) => b.id === baitId);
  if (!baitDef) return state;

  const totalCost = baitDef.price * qty;
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[baitId] = (inv[baitId] ?? 0) + qty;

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
  };
}

/** Sell fish for coins. */
export function sellFish(
  state: GameState,
  fishId: string,
  qty: number,
): GameState {
  if (qty <= 0) return state;
  const fishDef = FISH.find((f) => f.id === fishId);
  if (!fishDef) return state;

  const current = state.inventory[fishId] ?? 0;
  if (current < qty) return state;

  const inv = { ...state.inventory };
  inv[fishId] = current - qty;
  if (inv[fishId]! <= 0) delete inv[fishId];

  return {
    ...state,
    coins: parseFloat((state.coins + fishDef.sellPrice * qty).toFixed(4)),
    inventory: inv,
  };
}
