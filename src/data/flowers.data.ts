import type { FlowerId } from "../domain/types/ids";

export interface FlowerDef {
  id: FlowerId;
  name: string;
  emoji: string;
  level: number;
  seedPrice: number;
  growMs: number;
}

/**
 * Flowers grow on flower_bed cells. Harvested flowers are used for
 * beehive attachment and deliveries (no sell price from shop).
 */
export const FLOWERS: readonly FlowerDef[] = Object.freeze([
  { id: "sunpetal", name: "Sunpetal", emoji: "\ud83c\udf3b", level: 13, seedPrice: 16, growMs: 86_400_000 },
  { id: "bloom",    name: "Bloom",    emoji: "\ud83c\udf38", level: 22, seedPrice: 32, growMs: 172_800_000 },
  { id: "lily",     name: "Lily",     emoji: "\ud83c\udf3a", level: 27, seedPrice: 48, growMs: 432_000_000 },
]);

/** Lookup flower by ID. */
export function getFlowerDef(id: FlowerId): FlowerDef {
  const f = FLOWERS.find((f) => f.id === id);
  if (!f) throw new Error(`Unknown flower: ${id}`);
  return f;
}

/** Flowers available at a given Bumpkin level. */
export function unlockedFlowers(level: number): readonly FlowerDef[] {
  return FLOWERS.filter((f) => f.level <= level);
}
