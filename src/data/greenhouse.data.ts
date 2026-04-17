import type { GreenhouseCropId } from "../domain/types/ids";

export interface GreenhouseCropDef {
  id: GreenhouseCropId;
  name: string;
  emoji: string;
  level: number;
  seedPrice: number;
  growMs: number;
  oilCost: number;
  sellPrice: number;
}

/**
 * Greenhouse crops require the greenhouse building + oil to plant.
 */
export const GREENHOUSE_CROPS: readonly GreenhouseCropDef[] = Object.freeze([
  { id: "grape", name: "Grape", emoji: "\ud83c\udf47", level: 40, seedPrice: 160, growMs: 43_200_000,  oilCost: 3, sellPrice: 240 },
  { id: "rice",  name: "Rice",  emoji: "\ud83c\udf5a", level: 40, seedPrice: 240, growMs: 115_200_000, oilCost: 4, sellPrice: 320 },
  { id: "olive", name: "Olive", emoji: "\ud83e\uded2", level: 40, seedPrice: 320, growMs: 158_400_000, oilCost: 6, sellPrice: 400 },
]);

/** Lookup greenhouse crop by ID. */
export function getGreenhouseCropDef(id: GreenhouseCropId): GreenhouseCropDef {
  const c = GREENHOUSE_CROPS.find((c) => c.id === id);
  if (!c) throw new Error(`Unknown greenhouse crop: ${id}`);
  return c;
}

/** Greenhouse crops available at a given Bumpkin level. */
export function unlockedGreenhouseCrops(level: number): readonly GreenhouseCropDef[] {
  return GREENHOUSE_CROPS.filter((c) => c.level <= level);
}
