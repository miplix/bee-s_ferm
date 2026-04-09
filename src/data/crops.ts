export interface CropDef {
  id: string; name: string; emoji: string; sprite: string;
  growMs: number; harvest: number; seedPrice: number; sellPrice: number; level: number;
  stages: number; // number of growth stages in spritesheet
}

// Sprite: /crops/{id}/proc_sprite.png — horizontal spritesheet, each frame 16x32px
export const CROPS: CropDef[] = [
  { id: "sunflower",    name: "Подсолнух",    emoji: "🌻", sprite: "/crops/sunflower/proc_sprite.png",    growMs: 60_000,       harvest: 1,  seedPrice: 0.01, sellPrice: 0.02, level: 1, stages: 5 },
  { id: "potato",       name: "Картофель",    emoji: "🥔", sprite: "/crops/potato/proc_sprite.png",       growMs: 300_000,      harvest: 3,  seedPrice: 0.10, sellPrice: 0.80, level: 1, stages: 5 },
  { id: "pumpkin",      name: "Тыква",        emoji: "🎃", sprite: "/crops/pumpkin/proc_sprite.png",      growMs: 1_800_000,    harvest: 4,  seedPrice: 0.40, sellPrice: 1.90, level: 2, stages: 5 },
  { id: "carrot",       name: "Морковь",      emoji: "🥕", sprite: "/crops/carrot/proc_sprite.png",       growMs: 7_200_000,    harvest: 4,  seedPrice: 1.00, sellPrice: 4.50, level: 3, stages: 5 },
  { id: "cabbage",      name: "Капуста",      emoji: "🥬", sprite: "/crops/cabbage/proc_sprite.png",      growMs: 14_400_000,   harvest: 7,  seedPrice: 2.00, sellPrice: 8.40, level: 4, stages: 5 },
  { id: "beetroot",     name: "Свёкла",       emoji: "🫒", sprite: "/crops/beetroot/proc_sprite.png",     growMs: 28_800_000,   harvest: 5,  seedPrice: 5.00, sellPrice: 22.0, level: 5, stages: 5 },
  { id: "cauliflower",  name: "Цв.капуста",   emoji: "🥦", sprite: "/crops/cauliflower/proc_sprite.png",  growMs: 43_200_000,   harvest: 8,  seedPrice: 15.0, sellPrice: 58.0, level: 6, stages: 5 },
  { id: "parsnip",      name: "Пастернак",    emoji: "🌰", sprite: "/crops/parsnip/proc_sprite.png",      growMs: 43_200_000,   harvest: 10, seedPrice: 30.0, sellPrice: 135,  level: 7, stages: 5 },
  { id: "radish",       name: "Редис",        emoji: "🔴", sprite: "/crops/radish/proc_sprite.png",       growMs: 86_400_000,   harvest: 8,  seedPrice: 75.0, sellPrice: 400,  level: 8, stages: 5 },
  { id: "wheat",        name: "Пшеница",      emoji: "🌾", sprite: "/crops/wheat/proc_sprite.png",        growMs: 21_600_000,   harvest: 5,  seedPrice: 5.00, sellPrice: 18.0, level: 9, stages: 5 },
  { id: "kale",         name: "Кале",         emoji: "🥗", sprite: "/crops/kale/proc_sprite.png",         growMs: 129_600_000,  harvest: 10, seedPrice: 200,  sellPrice: 1000, level: 10, stages: 5 },
];

export const LEVELS = [
  { level: 1, xp: 0 }, { level: 2, xp: 100 }, { level: 3, xp: 200 }, { level: 4, xp: 350 },
  { level: 5, xp: 500 }, { level: 6, xp: 750 }, { level: 7, xp: 1000 }, { level: 8, xp: 1500 },
  { level: 9, xp: 2000 }, { level: 10, xp: 3000 },
];

export function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].xp) return LEVELS[i].level;
  return 1;
}

export const RECIPES = [
  { id: "pumpkin_soup", name: "Тыквенный суп", emoji: "🍲", xp: 24, ingredients: [{ id: "pumpkin", n: 1 }] },
  { id: "mashed_potato", name: "Пюре", emoji: "🥣", xp: 18, ingredients: [{ id: "potato", n: 3 }] },
  { id: "sunflower_cracker", name: "Крекер", emoji: "🍪", xp: 13, ingredients: [{ id: "sunflower", n: 5 }] },
];
