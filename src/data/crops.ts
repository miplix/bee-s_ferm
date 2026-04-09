export const SPRITE_SIZE = 36;
export const SPRITE_FRAMES = 11;

export interface CropDef {
  id: string; name: string; emoji: string; sprite: string;
  growMs: number; harvest: number; seedPrice: number; sellPrice: number; level: number;
}
export const CROPS: CropDef[] = [
  { id:"sunflower",  name:"Подсолнух",  emoji:"🌻", sprite:"/crops/sunflower/proc_sprite.png",  growMs:60_000,      harvest:1,  seedPrice:0.01, sellPrice:0.02, level:1 },
  { id:"potato",     name:"Картофель",  emoji:"🥔", sprite:"/crops/potato/proc_sprite.png",     growMs:300_000,     harvest:3,  seedPrice:0.10, sellPrice:0.80, level:1 },
  { id:"pumpkin",    name:"Тыква",      emoji:"🎃", sprite:"/crops/pumpkin/proc_sprite.png",    growMs:1_800_000,   harvest:4,  seedPrice:0.40, sellPrice:1.90, level:2 },
  { id:"carrot",     name:"Морковь",    emoji:"🥕", sprite:"/crops/carrot/proc_sprite.png",     growMs:7_200_000,   harvest:4,  seedPrice:1.00, sellPrice:4.50, level:3 },
  { id:"cabbage",    name:"Капуста",    emoji:"🥬", sprite:"/crops/cabbage/proc_sprite.png",    growMs:14_400_000,  harvest:7,  seedPrice:2.00, sellPrice:8.40, level:4 },
  { id:"beetroot",   name:"Свёкла",     emoji:"🫒", sprite:"/crops/beetroot/proc_sprite.png",   growMs:28_800_000,  harvest:5,  seedPrice:5.00, sellPrice:22.0, level:5 },
  { id:"cauliflower",name:"Цв.капуста", emoji:"🥦", sprite:"/crops/cauliflower/proc_sprite.png",growMs:43_200_000,  harvest:8,  seedPrice:15.0, sellPrice:58.0, level:6 },
  { id:"parsnip",    name:"Пастернак",  emoji:"🌰", sprite:"/crops/parsnip/proc_sprite.png",    growMs:43_200_000,  harvest:10, seedPrice:30.0, sellPrice:135,  level:7 },
  { id:"radish",     name:"Редис",      emoji:"🔴", sprite:"/crops/radish/proc_sprite.png",     growMs:86_400_000,  harvest:8,  seedPrice:75.0, sellPrice:400,  level:8 },
  { id:"wheat",      name:"Пшеница",    emoji:"🌾", sprite:"/crops/wheat/proc_sprite.png",      growMs:21_600_000,  harvest:5,  seedPrice:5.00, sellPrice:18.0, level:9 },
  { id:"kale",       name:"Кале",       emoji:"🥗", sprite:"/crops/kale/proc_sprite.png",       growMs:129_600_000, harvest:10, seedPrice:200,  sellPrice:1000, level:10 },
];

// === LEVELS (TZ 2.1, extended to 200) ===
export const LEVELS = [
  {level:1,xp:0},{level:2,xp:100},{level:3,xp:200},{level:4,xp:350},{level:5,xp:500},
  {level:6,xp:750},{level:7,xp:1000},{level:8,xp:1500},{level:9,xp:2000},{level:10,xp:3000},
  {level:11,xp:4500},{level:12,xp:6000},{level:15,xp:12000},{level:20,xp:30000},{level:25,xp:60000},
  {level:30,xp:100000},{level:40,xp:200000},{level:50,xp:400000},
];
export function getLevel(xp:number){for(let i=LEVELS.length-1;i>=0;i--)if(xp>=LEVELS[i].xp)return LEVELS[i].level;return 1;}

// === RECIPES (TZ 2.2) ===
export interface RecipeDef { id:string; name:string; emoji:string; xp:number; ingredients:{id:string;n:number}[]; building:string; }
export const RECIPES: RecipeDef[] = [
  {id:"pumpkin_soup",name:"Тыквенный суп",emoji:"🍲",xp:24,ingredients:[{id:"pumpkin",n:1}],building:"campfire"},
  {id:"mashed_potato",name:"Пюре",emoji:"🥣",xp:18,ingredients:[{id:"potato",n:3}],building:"campfire"},
  {id:"sunflower_cracker",name:"Крекер",emoji:"🍪",xp:13,ingredients:[{id:"sunflower",n:5}],building:"campfire"},
  {id:"farmer_salad",name:"Салат фермера",emoji:"🥗",xp:48,ingredients:[{id:"carrot",n:5},{id:"cabbage",n:3}],building:"kitchen"},
  {id:"fried_cabbage",name:"Жареная капуста",emoji:"🥬",xp:35,ingredients:[{id:"cabbage",n:5}],building:"kitchen"},
  {id:"milk_porridge",name:"Молочная каша",emoji:"🥛",xp:60,ingredients:[{id:"wheat",n:2},{id:"milk",n:1}],building:"kitchen"},
  {id:"beet_cake",name:"Свекольный торт",emoji:"🎂",xp:80,ingredients:[{id:"beetroot",n:5},{id:"egg",n:3},{id:"wheat",n:2}],building:"bakery"},
  {id:"honey_pie",name:"Медовый пирог",emoji:"🍯",xp:120,ingredients:[{id:"wheat",n:3},{id:"egg",n:2},{id:"honey",n:1}],building:"bakery"},
];

// === RESOURCE NODES (TZ 5) ===
export interface ResourceNodeDef { type:string; resource:string; amount:number; cooldownMs:number; emoji:string; }
export const RESOURCE_NODES: Record<string,ResourceNodeDef> = {
  tree:{type:"tree",resource:"wood",amount:5,cooldownMs:4*3600_000,emoji:"🌳"},
  rock:{type:"rock",resource:"stone",amount:3,cooldownMs:24*3600_000,emoji:"🪨"},
  iron:{type:"iron",resource:"iron",amount:5,cooldownMs:48*3600_000,emoji:"⛏️"},
  gold:{type:"gold",resource:"gold",amount:5,cooldownMs:72*3600_000,emoji:"✨"},
};

// === TOOLS (TZ 5.1) ===
export interface ToolDef { id:string; name:string; emoji:string; cost:Record<string,number>; forResource:string; }
export const TOOLS: ToolDef[] = [
  {id:"axe",name:"Топор",emoji:"🪓",cost:{wood:3},forResource:"tree"},
  {id:"stone_pickaxe",name:"Каменная кирка",emoji:"⛏️",cost:{wood:3,stone:3},forResource:"rock"},
  {id:"iron_pickaxe",name:"Железная кирка",emoji:"⛏️",cost:{wood:3,stone:5},forResource:"iron"},
  {id:"gold_pickaxe",name:"Золотая кирка",emoji:"⛏️",cost:{wood:5,stone:5,iron:5},forResource:"gold"},
];

// === BUILDINGS (TZ 6) ===
export interface BuildingDef { id:string; name:string; emoji:string; level:number; cost:Record<string,number>; desc:string; }
export const BUILDINGS: BuildingDef[] = [
  {id:"workbench",name:"Верстак",emoji:"🔨",level:1,cost:{},desc:"Крафт инструментов и зданий"},
  {id:"market",name:"Рынок",emoji:"🏪",level:1,cost:{},desc:"Покупка семян, продажа культур"},
  {id:"campfire",name:"Костёр",emoji:"🔥",level:2,cost:{wood:3,stone:3},desc:"Простые блюда (XP)"},
  {id:"well",name:"Колодец",emoji:"🪣",level:3,cost:{wood:5,stone:5},desc:"Питает грядки"},
  {id:"henhouse",name:"Курятник",emoji:"🐔",level:6,cost:{wood:10,stone:5,coins:50},desc:"До 10 кур"},
  {id:"kitchen",name:"Кухня",emoji:"🍳",level:8,cost:{wood:25,stone:10,iron:5},desc:"Средние блюда"},
  {id:"feeder",name:"Кормушка",emoji:"🥣",level:12,cost:{wood:15,stone:10},desc:"Корм для животных"},
  {id:"barn",name:"Хлев",emoji:"🐄",level:12,cost:{wood:20,stone:10,iron:10,coins:200},desc:"Коровы и овцы"},
  {id:"bakery",name:"Пекарня",emoji:"🧁",level:15,cost:{wood:30,stone:20,iron:10,gold:5},desc:"Выпечка, высокий XP"},
];

// === ANIMALS (TZ 7-8) ===
export interface AnimalLevel { level:number; xpNeeded:number; feedCost:number; product:string; amount:number; timeMs:number; }
export const CHICKEN_LEVELS: AnimalLevel[] = [
  {level:1,xpNeeded:0,feedCost:1,product:"egg",amount:1,timeMs:24*3600_000},
  {level:2,xpNeeded:50,feedCost:1,product:"egg",amount:1,timeMs:20*3600_000},
  {level:3,xpNeeded:120,feedCost:1,product:"egg",amount:2,timeMs:18*3600_000},
  {level:4,xpNeeded:250,feedCost:2,product:"egg",amount:2,timeMs:16*3600_000},
  {level:5,xpNeeded:500,feedCost:2,product:"egg",amount:2,timeMs:14*3600_000},
  {level:6,xpNeeded:1000,feedCost:2,product:"egg",amount:3,timeMs:12*3600_000},
];
export const COW_LEVELS: AnimalLevel[] = [
  {level:1,xpNeeded:0,feedCost:5,product:"milk",amount:2,timeMs:8*3600_000},
  {level:2,xpNeeded:80,feedCost:5,product:"milk",amount:2,timeMs:7*3600_000},
  {level:3,xpNeeded:200,feedCost:5,product:"milk",amount:3,timeMs:6*3600_000},
  {level:4,xpNeeded:400,feedCost:5,product:"milk",amount:3,timeMs:5*3600_000},
  {level:5,xpNeeded:800,feedCost:5,product:"milk",amount:4,timeMs:4*3600_000},
  {level:6,xpNeeded:1500,feedCost:5,product:"milk",amount:4,timeMs:3*3600_000},
];

// === EXPANSIONS (TZ 4.1) ===
export interface Expansion { id:number; minLevel:number; cost:Record<string,number>; adds:{plots:number;trees:number;rocks:number;iron:number;gold:number}; }
export const EXPANSIONS: Expansion[] = [
  {id:1,minLevel:1,cost:{wood:5},adds:{plots:3,trees:2,rocks:0,iron:0,gold:0}},
  {id:2,minLevel:3,cost:{wood:10,coins:0.10},adds:{plots:4,trees:2,rocks:1,iron:0,gold:0}},
  {id:3,minLevel:5,cost:{wood:15,stone:5},adds:{plots:4,trees:1,rocks:2,iron:0,gold:0}},
  {id:4,minLevel:7,cost:{wood:20,stone:10,coins:0.25},adds:{plots:5,trees:2,rocks:2,iron:1,gold:0}},
  {id:5,minLevel:8,cost:{wood:30,stone:15,iron:3},adds:{plots:5,trees:2,rocks:2,iron:1,gold:0}},
  {id:6,minLevel:9,cost:{wood:35,stone:20,iron:5,gold:1},adds:{plots:6,trees:3,rocks:2,iron:0,gold:1}},
  {id:7,minLevel:10,cost:{wood:40,stone:25,iron:7,gold:1},adds:{plots:6,trees:3,rocks:2,iron:1,gold:1}},
  {id:8,minLevel:11,cost:{wood:50,stone:30,iron:9,gold:1},adds:{plots:7,trees:3,rocks:3,iron:2,gold:0}},
  {id:9,minLevel:11,cost:{wood:60,stone:35,iron:9,gold:1},adds:{plots:8,trees:4,rocks:3,iron:2,gold:1}},
];

// === BEEHIVE (TZ 9) ===
export const BEEHIVE_COST = 1000; // pollen to buy Lv1
export const BEEHIVE_DAILY_POLLEN = 5; // per Lv1 hive
export const BEEHIVE_DEMO_DAILY = 0.4;
export const BEEHIVE_ACTION_INTERVAL = 8 * 3600_000; // 8h between actions
export const BEEHIVE_ACTIONS_TO_UPGRADE = 1000;

// Max beehive slots by level (TZ 9.3)
export function maxBeehiveSlots(level:number):number {
  if(level<10)return 0; if(level<15)return 1; if(level<25)return 2; if(level<30)return 3;
  if(level<35)return 4; if(level<40)return 5; if(level<45)return 6; if(level<50)return 7; return 8;
}

// Item sell prices for non-crop items
export const ITEM_SELL: Record<string,number> = {
  wood:0.05, stone:0.10, iron:0.50, gold:2.00, egg:0.30, milk:0.80, honey:5.00, pollen:0.01,
};

// === SHOP LIMITS ===
export interface ShopLimit {
  id: string; // item id (seed or tool)
  weeklyMax: number; // max per week
  dailyRestock: number; // how many restock per day
}

export const SHOP_LIMITS: ShopLimit[] = [
  // Seeds (weekly / daily restock)
  { id: "sunflower_seed", weeklyMax: 800, dailyRestock: 50 },
  { id: "potato_seed", weeklyMax: 400, dailyRestock: 25 },
  { id: "pumpkin_seed", weeklyMax: 200, dailyRestock: 12 },
  { id: "carrot_seed", weeklyMax: 100, dailyRestock: 6 },
  { id: "cabbage_seed", weeklyMax: 60, dailyRestock: 4 },
  { id: "beetroot_seed", weeklyMax: 40, dailyRestock: 3 },
  { id: "cauliflower_seed", weeklyMax: 30, dailyRestock: 2 },
  { id: "parsnip_seed", weeklyMax: 20, dailyRestock: 1 },
  { id: "radish_seed", weeklyMax: 15, dailyRestock: 1 },
  { id: "wheat_seed", weeklyMax: 50, dailyRestock: 3 },
  { id: "kale_seed", weeklyMax: 10, dailyRestock: 0 }, // weekly only
  // Tools
  { id: "axe", weeklyMax: 50, dailyRestock: 5 },
  { id: "stone_pickaxe", weeklyMax: 20, dailyRestock: 2 },
  { id: "iron_pickaxe", weeklyMax: 10, dailyRestock: 0 }, // weekly only
  { id: "gold_pickaxe", weeklyMax: 5, dailyRestock: 0 }, // weekly only
];

// Get current stock for an item
export function getShopStock(itemId: string, purchased: Record<string, { weekly: number; daily: number; lastDay: string; lastWeek: string }>): { available: number; dailyLeft: number; weeklyLeft: number } {
  const limit = SHOP_LIMITS.find(l => l.id === itemId);
  if (!limit) return { available: 999, dailyLeft: 999, weeklyLeft: 999 };

  const today = new Date().toISOString().slice(0, 10);
  const weekStart = getWeekStart();
  const rec = purchased[itemId] || { weekly: 0, daily: 0, lastDay: "", lastWeek: "" };

  const weeklyUsed = rec.lastWeek === weekStart ? rec.weekly : 0;
  const dailyUsed = rec.lastDay === today ? rec.daily : 0;

  const weeklyLeft = limit.weeklyMax - weeklyUsed;
  const dailyLeft = limit.dailyRestock > 0 ? limit.dailyRestock - dailyUsed : weeklyLeft;
  const available = Math.min(weeklyLeft, dailyLeft);

  return { available: Math.max(0, available), dailyLeft: Math.max(0, dailyLeft), weeklyLeft: Math.max(0, weeklyLeft) };
}

function getWeekStart(): string {
  const d = new Date(); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}
