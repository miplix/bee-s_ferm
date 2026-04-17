import type { AnimalKind } from "../domain/types/ids";

export interface AnimalLevelDef {
  level: number;
  xpNeeded: number;
  feedCost: number;       // units of feed per feeding
  product: string;        // what it produces
  amount: number;         // units per collection
  productionMs: number;   // time from feed to ready
}

/**
 * Chicken levels 1–6 (TZ 7.1).
 */
export const CHICKEN_LEVELS: readonly AnimalLevelDef[] = [
  { level: 1, xpNeeded: 0,    feedCost: 1, product: "egg", amount: 1, productionMs: 24 * 3600_000 },
  { level: 2, xpNeeded: 50,   feedCost: 1, product: "egg", amount: 1, productionMs: 20 * 3600_000 },
  { level: 3, xpNeeded: 120,  feedCost: 1, product: "egg", amount: 2, productionMs: 18 * 3600_000 },
  { level: 4, xpNeeded: 250,  feedCost: 2, product: "egg", amount: 2, productionMs: 16 * 3600_000 },
  { level: 5, xpNeeded: 500,  feedCost: 2, product: "egg", amount: 2, productionMs: 14 * 3600_000 },
  { level: 6, xpNeeded: 1000, feedCost: 2, product: "egg", amount: 3, productionMs: 12 * 3600_000 },
];

/**
 * Cow levels 1–6 (TZ 8.1).
 */
export const COW_LEVELS: readonly AnimalLevelDef[] = [
  { level: 1, xpNeeded: 0,    feedCost: 5, product: "milk", amount: 2, productionMs: 8 * 3600_000 },
  { level: 2, xpNeeded: 80,   feedCost: 5, product: "milk", amount: 2, productionMs: 7 * 3600_000 },
  { level: 3, xpNeeded: 200,  feedCost: 5, product: "milk", amount: 3, productionMs: 6 * 3600_000 },
  { level: 4, xpNeeded: 400,  feedCost: 5, product: "milk", amount: 3, productionMs: 5 * 3600_000 },
  { level: 5, xpNeeded: 800,  feedCost: 5, product: "milk", amount: 4, productionMs: 4 * 3600_000 },
  { level: 6, xpNeeded: 1500, feedCost: 5, product: "milk", amount: 4, productionMs: 3 * 3600_000 },
];

/**
 * Sheep levels 1-6.
 */
export const SHEEP_LEVELS: readonly AnimalLevelDef[] = [
  { level: 1, xpNeeded: 0,    feedCost: 3, product: "wool", amount: 1, productionMs: 16 * 3600_000 },
  { level: 2, xpNeeded: 60,   feedCost: 3, product: "wool", amount: 1, productionMs: 14 * 3600_000 },
  { level: 3, xpNeeded: 150,  feedCost: 3, product: "wool", amount: 2, productionMs: 12 * 3600_000 },
  { level: 4, xpNeeded: 300,  feedCost: 3, product: "wool", amount: 2, productionMs: 10 * 3600_000 },
  { level: 5, xpNeeded: 600,  feedCost: 3, product: "wool", amount: 3, productionMs: 8 * 3600_000 },
  { level: 6, xpNeeded: 1200, feedCost: 3, product: "wool", amount: 3, productionMs: 6 * 3600_000 },
];

/** Animal purchase costs (TZ 6.1 building requirements) */
export const ANIMAL_COSTS: Record<AnimalKind, { coins: number; building: string }> = {
  chicken: { coins: 50, building: "henhouse" },
  cow:     { coins: 200, building: "barn" },
  sheep:   { coins: 120, building: "barn" },
};

/** Max animals in a building at upgrade level */
export const ANIMAL_CAPACITY = (buildingLevel: number) => 10 + (buildingLevel - 1) * 5;

/** Lookup table for animal levels by kind */
const ANIMAL_LEVEL_TABLES: Record<AnimalKind, readonly AnimalLevelDef[]> = {
  chicken: CHICKEN_LEVELS,
  cow: COW_LEVELS,
  sheep: SHEEP_LEVELS,
};

/** Get current animal level def based on XP */
export function getAnimalLevel(kind: AnimalKind, xp: number): AnimalLevelDef {
  const table = ANIMAL_LEVEL_TABLES[kind];
  for (let i = table.length - 1; i >= 0; i--) {
    if (xp >= table[i].xpNeeded) return table[i];
  }
  return table[0];
}
