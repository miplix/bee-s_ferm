import type { FruitId } from "../domain/types/ids";

export interface FruitDef {
  id: FruitId;
  name: string;
  emoji: string;
  level: number;
  seedPrice: number;
  growMs: number;
  sellPrice: number;
  minHarvests: number;
  maxHarvests: number;
}

/**
 * All fruit bushes. Each bush yields minHarvests..maxHarvests before depleting.
 * Harvest count is determined by seeded PRNG at plant time.
 */
export const FRUITS: readonly FruitDef[] = Object.freeze([
  { id: "tomato",    name: "Tomato",    emoji: "\ud83c\udf45", level: 12, seedPrice: 5,  growMs: 7_200_000,   sellPrice: 2,  minHarvests: 3, maxHarvests: 6 },
  { id: "lemon",     name: "Lemon",     emoji: "\ud83c\udf4b", level: 12, seedPrice: 15, growMs: 14_400_000,  sellPrice: 6,  minHarvests: 3, maxHarvests: 6 },
  { id: "blueberry", name: "Blueberry", emoji: "\ud83e\uded0", level: 13, seedPrice: 30, growMs: 21_600_000,  sellPrice: 12, minHarvests: 3, maxHarvests: 6 },
  { id: "orange",    name: "Orange",    emoji: "\ud83c\udf4a", level: 13, seedPrice: 50, growMs: 28_800_000,  sellPrice: 18, minHarvests: 3, maxHarvests: 6 },
  { id: "apple",     name: "Apple",     emoji: "\ud83c\udf4e", level: 14, seedPrice: 70, growMs: 43_200_000,  sellPrice: 25, minHarvests: 3, maxHarvests: 6 },
  { id: "banana",    name: "Banana",    emoji: "\ud83c\udf4c", level: 14, seedPrice: 70, growMs: 43_200_000,  sellPrice: 25, minHarvests: 3, maxHarvests: 6 },
]);

/** Lookup fruit by ID. */
export function getFruitDef(id: FruitId): FruitDef {
  const f = FRUITS.find((f) => f.id === id);
  if (!f) throw new Error(`Unknown fruit: ${id}`);
  return f;
}

/** Fruits available at a given Bumpkin level. */
export function unlockedFruits(level: number): readonly FruitDef[] {
  return FRUITS.filter((f) => f.level <= level);
}
