// Crop spritesheets: 396x36px = 11 frames of 36x36 each
export const SPRITE_SIZE = 36;
export const SPRITE_FRAMES = 11;

export interface CropDef {
  id: string; name: string; emoji: string; sprite: string;
  growMs: number; harvest: number; seedPrice: number; sellPrice: number; level: number;
}

export const CROPS: CropDef[] = [
  { id: "sunflower",   name: "Подсолнух",   emoji: "🌻", sprite: "/crops/sunflower/proc_sprite.png",   growMs: 60_000,       harvest: 1,  seedPrice: 0.01, sellPrice: 0.02, level: 1 },
  { id: "potato",      name: "Картофель",   emoji: "🥔", sprite: "/crops/potato/proc_sprite.png",      growMs: 300_000,      harvest: 3,  seedPrice: 0.10, sellPrice: 0.80, level: 1 },
  { id: "pumpkin",     name: "Тыква",       emoji: "🎃", sprite: "/crops/pumpkin/proc_sprite.png",     growMs: 1_800_000,    harvest: 4,  seedPrice: 0.40, sellPrice: 1.90, level: 2 },
  { id: "carrot",      name: "Морковь",     emoji: "🥕", sprite: "/crops/carrot/proc_sprite.png",      growMs: 7_200_000,    harvest: 4,  seedPrice: 1.00, sellPrice: 4.50, level: 3 },
  { id: "cabbage",     name: "Капуста",     emoji: "🥬", sprite: "/crops/cabbage/proc_sprite.png",     growMs: 14_400_000,   harvest: 7,  seedPrice: 2.00, sellPrice: 8.40, level: 4 },
  { id: "beetroot",    name: "Свёкла",      emoji: "🫒", sprite: "/crops/beetroot/proc_sprite.png",    growMs: 28_800_000,   harvest: 5,  seedPrice: 5.00, sellPrice: 22.0, level: 5 },
  { id: "cauliflower", name: "Цв.капуста",  emoji: "🥦", sprite: "/crops/cauliflower/proc_sprite.png", growMs: 43_200_000,   harvest: 8,  seedPrice: 15.0, sellPrice: 58.0, level: 6 },
  { id: "parsnip",     name: "Пастернак",   emoji: "🌰", sprite: "/crops/parsnip/proc_sprite.png",     growMs: 43_200_000,   harvest: 10, seedPrice: 30.0, sellPrice: 135,  level: 7 },
  { id: "radish",      name: "Редис",       emoji: "🔴", sprite: "/crops/radish/proc_sprite.png",      growMs: 86_400_000,   harvest: 8,  seedPrice: 75.0, sellPrice: 400,  level: 8 },
  { id: "wheat",       name: "Пшеница",     emoji: "🌾", sprite: "/crops/wheat/proc_sprite.png",       growMs: 21_600_000,   harvest: 5,  seedPrice: 5.00, sellPrice: 18.0, level: 9 },
  { id: "kale",        name: "Кале",        emoji: "🥗", sprite: "/crops/kale/proc_sprite.png",        growMs: 129_600_000,  harvest: 10, seedPrice: 200,  sellPrice: 1000, level: 10 },
];

export const LEVELS = [
  { level: 1, xp: 0 }, { level: 2, xp: 100 }, { level: 3, xp: 200 }, { level: 4, xp: 350 },
  { level: 5, xp: 500 }, { level: 6, xp: 750 }, { level: 7, xp: 1000 }, { level: 8, xp: 1500 },
  { level: 9, xp: 2000 }, { level: 10, xp: 3000 }, { level: 11, xp: 4500 }, { level: 12, xp: 6000 },
  { level: 15, xp: 12000 }, { level: 20, xp: 30000 }, { level: 25, xp: 60000 },
];

export function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].xp) return LEVELS[i].level;
  return 1;
}

export const RECIPES = [
  { id: "pumpkin_soup", name: "Тыквенный суп", emoji: "🍲", xp: 24, ingredients: [{ id: "pumpkin", n: 1 }], building: "campfire" },
  { id: "mashed_potato", name: "Пюре", emoji: "🥣", xp: 18, ingredients: [{ id: "potato", n: 3 }], building: "campfire" },
  { id: "sunflower_cracker", name: "Крекер", emoji: "🍪", xp: 13, ingredients: [{ id: "sunflower", n: 5 }], building: "campfire" },
  { id: "farmer_salad", name: "Салат фермера", emoji: "🥗", xp: 48, ingredients: [{ id: "carrot", n: 5 }, { id: "cabbage", n: 3 }], building: "kitchen" },
  { id: "fried_cabbage", name: "Жареная капуста", emoji: "🥬", xp: 35, ingredients: [{ id: "cabbage", n: 5 }], building: "kitchen" },
];

// Resource nodes
export interface ResourceNode {
  type: "tree" | "rock" | "iron" | "gold";
  resource: string; amount: number; cooldownMs: number;
  emoji: string; img?: string;
}
export const RESOURCE_NODES: Record<string, ResourceNode> = {
  tree: { type: "tree", resource: "wood", amount: 5, cooldownMs: 4 * 3600_000, emoji: "🌳" },
  rock: { type: "rock", resource: "stone", amount: 3, cooldownMs: 24 * 3600_000, emoji: "🪨", img: "/resources/stone_empty.png" },
  iron: { type: "iron", resource: "iron", amount: 5, cooldownMs: 48 * 3600_000, emoji: "⛏️", img: "/resources/iron_rock.png" },
  gold: { type: "gold", resource: "gold", amount: 5, cooldownMs: 72 * 3600_000, emoji: "✨", img: "/resources/gold_rock.png" },
};

// Expansions (from TZ section 4.1)
export interface Expansion {
  id: number; minLevel: number;
  cost: Record<string, number>; // resource -> amount
  adds: { plots: number; trees: number; rocks: number; iron: number; gold: number };
}
export const EXPANSIONS: Expansion[] = [
  { id: 1, minLevel: 1, cost: { wood: 5 }, adds: { plots: 3, trees: 2, rocks: 0, iron: 0, gold: 0 } },
  { id: 2, minLevel: 3, cost: { wood: 10, coins: 0.10 }, adds: { plots: 4, trees: 2, rocks: 1, iron: 0, gold: 0 } },
  { id: 3, minLevel: 5, cost: { wood: 15, stone: 5 }, adds: { plots: 4, trees: 1, rocks: 2, iron: 0, gold: 0 } },
  { id: 4, minLevel: 7, cost: { wood: 20, stone: 10, coins: 0.25 }, adds: { plots: 5, trees: 2, rocks: 2, iron: 1, gold: 0 } },
  { id: 5, minLevel: 8, cost: { wood: 30, stone: 15, iron: 3 }, adds: { plots: 5, trees: 2, rocks: 2, iron: 1, gold: 0 } },
];
