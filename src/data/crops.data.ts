import type { CropId, Season, IslandId } from "../domain/types/ids";

/** Island progression order for minIsland checks. */
export const ISLAND_ORDER: Record<IslandId, number> = {
  basic: 0, spring: 1, desert: 2, volcano: 3,
};

export interface CropDef {
  id: CropId;
  name: string;
  emoji: string;
  sprite: string | null;
  level: number;
  growMs: number;
  seedPrice: number;
  sellPrice: number;
  harvestCount: number;
  seasons: Season[] | "all";
  minIsland?: IslandId;   // undefined = available everywhere
}

/**
 * All 23 crops — SFL values for prices & grow times.
 * Source: research/01_levels_and_crops.md (from SFL crops.ts)
 */
export const CROPS: readonly CropDef[] = Object.freeze([
  { id: "sunflower",    name: "Sunflower",     emoji: "🌻", sprite: "/crops/sunflower/proc_sprite.png",  level: 1,  growMs: 60_000,         seedPrice: 0.01,  sellPrice: 0.02,  harvestCount: 1,  seasons: "all" },
  { id: "potato",       name: "Potato",        emoji: "🥔", sprite: "/crops/potato/proc_sprite.png",     level: 1,  growMs: 300_000,        seedPrice: 0.10,  sellPrice: 0.14,  harvestCount: 1,  seasons: "all" },
  { id: "rhubarb",      name: "Rhubarb",       emoji: "🌿", sprite: null,                                level: 1,  growMs: 900_000,        seedPrice: 0.50,  sellPrice: 0.24,  harvestCount: 1,  seasons: ["spring"] },
  { id: "pumpkin",      name: "Pumpkin",       emoji: "🎃", sprite: "/crops/pumpkin/proc_sprite.png",    level: 2,  growMs: 1_800_000,      seedPrice: 0.20,  sellPrice: 0.40,  harvestCount: 1,  seasons: ["autumn"] },
  { id: "zucchini",     name: "Zucchini",      emoji: "🥒", sprite: null,                                level: 2,  growMs: 3_600_000,      seedPrice: 0.70,  sellPrice: 0.60,  harvestCount: 1,  seasons: ["summer"] },
  { id: "carrot",       name: "Carrot",        emoji: "🥕", sprite: "/crops/carrot/proc_sprite.png",     level: 2,  growMs: 3_600_000,      seedPrice: 0.50,  sellPrice: 0.80,  harvestCount: 1,  seasons: "all" },
  { id: "yam",          name: "Yam",           emoji: "🍠", sprite: null,                                level: 3,  growMs: 7_200_000,      seedPrice: 0.90,  sellPrice: 1.50,  harvestCount: 1,  seasons: ["autumn"] },
  { id: "cabbage",      name: "Cabbage",       emoji: "🥬", sprite: "/crops/cabbage/proc_sprite.png",    level: 3,  growMs: 7_200_000,      seedPrice: 1.00,  sellPrice: 1.50,  harvestCount: 1,  seasons: "all" },
  { id: "broccoli",     name: "Broccoli",      emoji: "🥦", sprite: null,                                level: 3,  growMs: 7_200_000,      seedPrice: 1.20,  sellPrice: 1.70,  harvestCount: 1,  seasons: ["spring"] },
  { id: "soybean",      name: "Soybean",       emoji: "🫘", sprite: null,                                level: 3,  growMs: 10_800_000,     seedPrice: 1.50,  sellPrice: 2.30,  harvestCount: 1,  seasons: "all" },
  { id: "beetroot",     name: "Beetroot",      emoji: "🫒", sprite: "/crops/beetroot/proc_sprite.png",   level: 3,  growMs: 14_400_000,     seedPrice: 2.00,  sellPrice: 2.80,  harvestCount: 1,  seasons: ["summer", "winter"] },
  { id: "pepper",       name: "Pepper",        emoji: "🌶️", sprite: null,                               level: 4,  growMs: 14_400_000,     seedPrice: 3.00,  sellPrice: 3.00,  harvestCount: 1,  seasons: ["summer"] },
  { id: "cauliflower",  name: "Cauliflower",   emoji: "🥦", sprite: "/crops/cauliflower/proc_sprite.png",level: 4,  growMs: 28_800_000,     seedPrice: 3.00,  sellPrice: 4.25,  harvestCount: 1,  seasons: "all" },
  { id: "parsnip",      name: "Parsnip",       emoji: "🌰", sprite: "/crops/parsnip/proc_sprite.png",    level: 4,  growMs: 43_200_000,     seedPrice: 5.00,  sellPrice: 6.50,  harvestCount: 1,  seasons: ["autumn", "winter"] },
  { id: "eggplant",     name: "Eggplant",      emoji: "🍆", sprite: null,                                level: 5,  growMs: 57_600_000,     seedPrice: 6.00,  sellPrice: 8.00,  harvestCount: 1,  seasons: ["summer", "autumn"] },
  { id: "corn",         name: "Corn",          emoji: "🌽", sprite: "/crops/corn/proc_sprite.png",       level: 5,  growMs: 72_000_000,     seedPrice: 7.00,  sellPrice: 9.00,  harvestCount: 1,  seasons: ["spring", "summer"] },
  { id: "onion",        name: "Onion",         emoji: "🧅", sprite: null,                                level: 5,  growMs: 72_000_000,     seedPrice: 7.00,  sellPrice: 10.00, harvestCount: 1,  seasons: ["winter"] },
  { id: "radish",       name: "Radish",        emoji: "🔴", sprite: "/crops/radish/proc_sprite.png",     level: 7,  growMs: 86_400_000,     seedPrice: 7.00,  sellPrice: 9.50,  harvestCount: 1,  seasons: ["summer"] },
  { id: "wheat",        name: "Wheat",         emoji: "🌾", sprite: "/crops/wheat/proc_sprite.png",      level: 7,  growMs: 86_400_000,     seedPrice: 5.00,  sellPrice: 7.00,  harvestCount: 1,  seasons: "all" },
  { id: "turnip",       name: "Turnip",        emoji: "🥬", sprite: null,                                level: 8,  growMs: 86_400_000,     seedPrice: 5.00,  sellPrice: 8.00,  harvestCount: 1,  seasons: ["winter"] },
  { id: "kale",         name: "Kale",          emoji: "🥗", sprite: "/crops/kale/proc_sprite.png",       level: 9,  growMs: 129_600_000,    seedPrice: 7.00,  sellPrice: 10.00, harvestCount: 1,  seasons: "all" },
  { id: "artichoke",    name: "Artichoke",     emoji: "🌺", sprite: null,                                level: 10, growMs: 129_600_000,    seedPrice: 8.00,  sellPrice: 12.00, harvestCount: 1,  seasons: ["spring", "autumn"] },
  { id: "barley",       name: "Barley",        emoji: "🌿", sprite: null,  level: 14, growMs: 172_800_000, seedPrice: 10.00, sellPrice: 12.00, harvestCount: 1, seasons: "all" },
  // --- Desert Island ---
  { id: "cactus",       name: "Cactus",        emoji: "🌵", sprite: null,  level: 20, growMs:   7_200_000, seedPrice:  3.00, sellPrice:  5.00, harvestCount: 1, seasons: "all", minIsland: "desert" },
  { id: "dates",        name: "Dates",         emoji: "🌴", sprite: null,  level: 22, growMs:  21_600_000, seedPrice:  6.00, sellPrice: 10.00, harvestCount: 2, seasons: "all", minIsland: "desert" },
  { id: "agave",        name: "Agave",         emoji: "🪴", sprite: null,  level: 25, growMs:  86_400_000, seedPrice: 10.00, sellPrice: 18.00, harvestCount: 1, seasons: "all", minIsland: "desert" },
  // --- Volcano Island ---
  { id: "lava_rose",    name: "Lava Rose",     emoji: "🌹", sprite: null,  level: 32, growMs: 172_800_000, seedPrice: 15.00, sellPrice: 25.00, harvestCount: 1, seasons: "all", minIsland: "volcano" },
  { id: "dragon_fruit", name: "Dragon Fruit",  emoji: "🐉", sprite: null,  level: 35, growMs: 432_000_000, seedPrice: 20.00, sellPrice: 35.00, harvestCount: 2, seasons: "all", minIsland: "volcano" },
]);

/** Lookup crop by ID. */
export function getCropDef(id: CropId): CropDef {
  const c = CROPS.find((c) => c.id === id);
  if (!c) throw new Error(`Unknown crop: ${id}`);
  return c;
}

/** Crops available at a given Bumpkin level. */
export function unlockedCrops(level: number): readonly CropDef[] {
  return CROPS.filter((c) => c.level <= level);
}
