// Fishing data — simplified MVP
// Rarity probabilities: common 60%, uncommon 25%, rare 15%

export type FishRarity = "common" | "uncommon" | "rare";

export interface BaitDef {
  id: string;
  name: string;
  emoji: string;
  price: number;        // 0 = free starter
}

export interface FishDef {
  id: string;
  name: string;
  emoji: string;
  xp: number;
  sellPrice: number;
  rarity: FishRarity;
  minLevel: number;
}

/** Daily casting limit (base, before any boosts). */
export const DAILY_CAST_LIMIT = 20;

/** Fishing rod crafting cost. */
export const FISHING_ROD_COST: Record<string, number> = {
  wood: 3,
  coins: 10,
};

// --- Bait ---

export const BAITS: readonly BaitDef[] = Object.freeze([
  { id: "earthworm",    name: "Earthworm",    emoji: "🪱", price: 0 },
  { id: "fishing_lure", name: "Fishing Lure", emoji: "🎣", price: 10 },
]);

export function getBaitDef(id: string): BaitDef {
  const b = BAITS.find((b) => b.id === id);
  if (!b) throw new Error(`Unknown bait: ${id}`);
  return b;
}

// --- Fish ---

export const FISH: readonly FishDef[] = Object.freeze([
  // Basic (common)
  { id: "anchovy",     name: "Anchovy",     emoji: "🐟", xp: 60,  sellPrice: 1.5,  rarity: "common",   minLevel: 1 },
  { id: "squid",       name: "Squid",       emoji: "🦑", xp: 80,  sellPrice: 2.5,  rarity: "common",   minLevel: 1 },
  { id: "carp",        name: "Carp",        emoji: "🐠", xp: 100, sellPrice: 4.0,  rarity: "common",   minLevel: 2 },
  // Advanced (uncommon)
  { id: "tuna",        name: "Tuna",        emoji: "🐟", xp: 200, sellPrice: 10.0, rarity: "uncommon", minLevel: 3 },
  { id: "swordfish",   name: "Swordfish",   emoji: "🗡️", xp: 300, sellPrice: 18.0, rarity: "uncommon", minLevel: 5 },
  // Rare
  { id: "whale_shark", name: "Whale Shark", emoji: "🦈", xp: 500, sellPrice: 50.0, rarity: "rare",     minLevel: 7 },
]);

export function getFishDef(id: string): FishDef {
  const f = FISH.find((f) => f.id === id);
  if (!f) throw new Error(`Unknown fish: ${id}`);
  return f;
}

/** Probability weight per rarity tier. */
export const RARITY_WEIGHTS: Record<FishRarity, number> = {
  common: 0.60,
  uncommon: 0.25,
  rare: 0.15,
};
