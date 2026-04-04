import type { ItemDef } from "@/types";

export const GRID_COLS = 12;
export const GRID_ROWS = 10;
export const CELL_SIZE = 64; // px

// All item/object definitions
export const ITEM_DEFS: Record<string, ItemDef> = {
  oak_tree: {
    type: "oak_tree", name: "Дуб", emoji: "🌳", color: "#2d6b35",
    placeable: false, destroyTime: 3000, dropType: "wood", dropAmount: 3,
  },
  pine_tree: {
    type: "pine_tree", name: "Ель", emoji: "🌲", color: "#1a5c2a",
    placeable: false, destroyTime: 2500, dropType: "wood", dropAmount: 2,
  },
  rock: {
    type: "rock", name: "Камень", emoji: "🪨", color: "#808080",
    placeable: false, destroyTime: 4000, dropType: "stone", dropAmount: 2,
  },
  gold_rock: {
    type: "gold_rock", name: "Золотая руда", emoji: "✨", color: "#ffd700",
    placeable: false, destroyTime: 5000, dropType: "gold", dropAmount: 1,
  },
  bush: {
    type: "bush", name: "Куст", emoji: "🌿", color: "#4a8c5c",
    placeable: false, destroyTime: 1500, dropType: "berry", dropAmount: 2,
  },
  // Placeable items (from inventory)
  fence: {
    type: "fence", name: "Забор", emoji: "🪵", color: "#8B4513",
    placeable: true, destroyTime: 0,
  },
  flower_bed: {
    type: "flower_bed", name: "Клумба", emoji: "🌸", color: "#ff69b4",
    placeable: true, destroyTime: 0,
  },
  campfire: {
    type: "campfire", name: "Костёр", emoji: "🔥", color: "#ff6600",
    placeable: true, destroyTime: 0,
  },
  chest: {
    type: "chest", name: "Сундук", emoji: "📦", color: "#8B6914",
    placeable: true, destroyTime: 0,
  },
  scarecrow: {
    type: "scarecrow", name: "Пугало", emoji: "🧑‍🌾", color: "#daa520",
    placeable: true, destroyTime: 0,
  },
};

// Resource definitions (non-placeable, stackable in inventory)
export const RESOURCE_DEFS: Record<string, { name: string; emoji: string }> = {
  wood:  { name: "Дерево", emoji: "🪵" },
  stone: { name: "Камень", emoji: "🪨" },
  gold:  { name: "Золото", emoji: "🪙" },
  berry: { name: "Ягоды", emoji: "🫐" },
};

// Initial scenery objects on a new farm
export function generateInitialScenery(): { type: string; x: number; y: number }[] {
  const scenery = [
    { type: "oak_tree", x: 2, y: 1 },
    { type: "oak_tree", x: 8, y: 2 },
    { type: "pine_tree", x: 1, y: 5 },
    { type: "pine_tree", x: 10, y: 7 },
    { type: "rock", x: 5, y: 3 },
    { type: "rock", x: 9, y: 5 },
    { type: "gold_rock", x: 3, y: 8 },
    { type: "bush", x: 7, y: 1 },
    { type: "bush", x: 4, y: 6 },
    { type: "bush", x: 11, y: 4 },
    { type: "oak_tree", x: 6, y: 9 },
    { type: "rock", x: 0, y: 3 },
  ];
  return scenery;
}
