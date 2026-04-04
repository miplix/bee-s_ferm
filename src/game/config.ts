import type { ItemDef, CropDef } from "@/types";

export const GRID_COLS = 12;
export const GRID_ROWS = 10;
export const CELL_SIZE = 64;

// === ITEM DEFINITIONS ===
export const ITEM_DEFS: Record<string, ItemDef> = {
  // Scenery (destroy to get resources)
  oak_tree:  { type: "oak_tree",  name: "Дуб",          emoji: "🌳", color: "#2d6b35", placeable: false, destroyTime: 3000, dropType: "wood",  dropAmount: 3 },
  pine_tree: { type: "pine_tree", name: "Ель",          emoji: "🌲", color: "#1a5c2a", placeable: false, destroyTime: 2500, dropType: "wood",  dropAmount: 2 },
  rock:      { type: "rock",      name: "Камень",       emoji: "🪨", color: "#808080", placeable: false, destroyTime: 4000, dropType: "stone", dropAmount: 2 },
  gold_rock: { type: "gold_rock", name: "Золотая руда", emoji: "✨", color: "#ffd700", placeable: false, destroyTime: 5000, dropType: "gold",  dropAmount: 1 },
  bush:      { type: "bush",      name: "Куст",         emoji: "🌿", color: "#4a8c5c", placeable: false, destroyTime: 1500, dropType: "berry", dropAmount: 2 },
  // Placeable items
  fence:      { type: "fence",      name: "Забор",   emoji: "🪵",    color: "#8B4513", placeable: true, destroyTime: 0 },
  flower_bed: { type: "flower_bed", name: "Клумба",  emoji: "🌸",    color: "#ff69b4", placeable: true, destroyTime: 0 },
  campfire:   { type: "campfire",   name: "Костёр",  emoji: "🔥",    color: "#ff6600", placeable: true, destroyTime: 0 },
  chest:      { type: "chest",      name: "Сундук",  emoji: "📦",    color: "#8B6914", placeable: true, destroyTime: 0 },
  scarecrow:  { type: "scarecrow",  name: "Пугало",  emoji: "🧑‍🌾", color: "#daa520", placeable: true, destroyTime: 0 },
  // Farm field — special placeable that allows planting crops
  field:      { type: "field",      name: "Грядка",  emoji: "🟫",    color: "#5c3a1e", placeable: true, destroyTime: 0, isField: true },
};

// === CROP DEFINITIONS ===
export const CROP_DEFS: Record<string, CropDef> = {
  sunflower: {
    type: "sunflower", name: "Подсолнух", emoji: "🌻", seedEmoji: "🌱",
    growthTime: 60_000, seedPrice: 1, sellPrice: 2, harvestAmount: 1, xp: 1,
    stages: ["🌱", "🌿", "🌻"],
  },
  potato: {
    type: "potato", name: "Картофель", emoji: "🥔", seedEmoji: "🌱",
    growthTime: 300_000, seedPrice: 5, sellPrice: 15, harvestAmount: 2, xp: 5,
    stages: ["🌱", "🌿", "☘️", "🥔"],
  },
  pumpkin: {
    type: "pumpkin", name: "Тыква", emoji: "🎃", seedEmoji: "🌱",
    growthTime: 3_600_000, seedPrice: 20, sellPrice: 100, harvestAmount: 1, xp: 20,
    stages: ["🌱", "🌿", "🍃", "🎃"],
  },
  wheat: {
    type: "wheat", name: "Пшеница", emoji: "🌾", seedEmoji: "🌱",
    growthTime: 14_400_000, seedPrice: 80, sellPrice: 700, harvestAmount: 3, xp: 100,
    stages: ["🌱", "🌿", "🌾", "🌾"],
  },
  strawberry: {
    type: "strawberry", name: "Клубника", emoji: "🍓", seedEmoji: "🌱",
    growthTime: 86_400_000, seedPrice: 200, sellPrice: 2500, harvestAmount: 5, xp: 300,
    stages: ["🌱", "🌿", "🌸", "🍓"],
  },
};

// === RESOURCE DEFS ===
export const RESOURCE_DEFS: Record<string, { name: string; emoji: string; sellPrice?: number }> = {
  wood:  { name: "Дерево", emoji: "🪵", sellPrice: 3 },
  stone: { name: "Камень", emoji: "🪨", sellPrice: 5 },
  gold:  { name: "Золото", emoji: "🪙", sellPrice: 20 },
  berry: { name: "Ягоды", emoji: "🫐", sellPrice: 2 },
  // Harvested crops (sellable)
  sunflower_harvest: { name: "Подсолнух",  emoji: "🌻", sellPrice: 2 },
  potato_harvest:    { name: "Картофель",  emoji: "🥔", sellPrice: 15 },
  pumpkin_harvest:   { name: "Тыква",      emoji: "🎃", sellPrice: 100 },
  wheat_harvest:     { name: "Пшеница",    emoji: "🌾", sellPrice: 700 },
  strawberry_harvest:{ name: "Клубника",   emoji: "🍓", sellPrice: 2500 },
};

// === INITIAL SCENERY ===
export function generateInitialScenery(): { type: string; x: number; y: number }[] {
  return [
    { type: "oak_tree", x: 0, y: 0 }, { type: "oak_tree", x: 8, y: 2 },
    { type: "pine_tree", x: 1, y: 5 }, { type: "pine_tree", x: 10, y: 7 },
    { type: "rock", x: 5, y: 3 }, { type: "rock", x: 9, y: 5 },
    { type: "gold_rock", x: 3, y: 8 },
    { type: "bush", x: 7, y: 1 }, { type: "bush", x: 4, y: 6 }, { type: "bush", x: 11, y: 4 },
    { type: "oak_tree", x: 6, y: 9 }, { type: "rock", x: 0, y: 3 },
    // Starting fields (3x3 area)
    { type: "field", x: 3, y: 3 }, { type: "field", x: 4, y: 3 }, { type: "field", x: 5, y: 3 },
    { type: "field", x: 3, y: 4 }, { type: "field", x: 4, y: 4 }, { type: "field", x: 5, y: 4 },
    { type: "field", x: 3, y: 5 }, { type: "field", x: 4, y: 5 }, { type: "field", x: 5, y: 5 },
  ];
}

// Starting coins
export const STARTING_COINS = 50;
