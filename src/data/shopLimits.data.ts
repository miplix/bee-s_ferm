/**
 * Shop stock limits — weekly max and daily restock.
 * Seeds and tools have limited supply that replenishes over time.
 */

export interface ShopLimitDef {
  id: string;
  weeklyMax: number;
  dailyRestock: number;   // 0 = weekly only, no daily restock
}

export const SHOP_LIMITS: readonly ShopLimitDef[] = [
  // Seeds (weekly max / daily restock)
  { id: "sunflower_seed",   weeklyMax: 400, dailyRestock: 50 },
  { id: "potato_seed",      weeklyMax: 200, dailyRestock: 30 },
  { id: "rhubarb_seed",     weeklyMax: 150, dailyRestock: 20 },
  { id: "pumpkin_seed",     weeklyMax: 150, dailyRestock: 20 },
  { id: "zucchini_seed",    weeklyMax: 100, dailyRestock: 15 },
  { id: "carrot_seed",      weeklyMax: 100, dailyRestock: 10 },
  { id: "yam_seed",         weeklyMax: 80,  dailyRestock: 8 },
  { id: "cabbage_seed",     weeklyMax: 60,  dailyRestock: 6 },
  { id: "broccoli_seed",    weeklyMax: 60,  dailyRestock: 6 },
  { id: "soybean_seed",     weeklyMax: 50,  dailyRestock: 5 },
  { id: "beetroot_seed",    weeklyMax: 40,  dailyRestock: 4 },
  { id: "pepper_seed",      weeklyMax: 40,  dailyRestock: 4 },
  { id: "cauliflower_seed", weeklyMax: 30,  dailyRestock: 3 },
  { id: "parsnip_seed",     weeklyMax: 20,  dailyRestock: 2 },
  { id: "eggplant_seed",    weeklyMax: 20,  dailyRestock: 2 },
  { id: "corn_seed",        weeklyMax: 20,  dailyRestock: 2 },
  { id: "onion_seed",       weeklyMax: 20,  dailyRestock: 2 },
  { id: "radish_seed",      weeklyMax: 15,  dailyRestock: 1 },
  { id: "wheat_seed",       weeklyMax: 50,  dailyRestock: 5 },
  { id: "turnip_seed",      weeklyMax: 15,  dailyRestock: 1 },
  { id: "kale_seed",        weeklyMax: 10,  dailyRestock: 0 },  // weekly only
  { id: "artichoke_seed",   weeklyMax: 10,  dailyRestock: 0 },
  { id: "barley_seed",      weeklyMax: 10,  dailyRestock: 0 },
  // Tools
  { id: "axe",              weeklyMax: 200, dailyRestock: 50 },
  { id: "stone_pickaxe",    weeklyMax: 50,  dailyRestock: 10 },
  { id: "iron_pickaxe",     weeklyMax: 20,  dailyRestock: 3 },
  { id: "gold_pickaxe",     weeklyMax: 10,  dailyRestock: 0 },  // weekly only
  { id: "fishing_rod",      weeklyMax: 30,  dailyRestock: 5 },
];

/** Get ISO week start (Monday) for a given timestamp. */
export function getWeekStart(now: number): string {
  const d = new Date(now);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff).toISOString().slice(0, 10);
}

/** Get ISO date for today. */
export function getToday(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Compute available stock for a shop item. */
export function getShopStock(
  itemId: string,
  purchases: Record<string, { weekly: number; daily: number; lastDay: string; lastWeek: string }>,
  now: number,
): { available: number; dailyLeft: number; weeklyLeft: number } {
  const limit = SHOP_LIMITS.find((l) => l.id === itemId);
  if (!limit) return { available: 999, dailyLeft: 999, weeklyLeft: 999 };

  const today = getToday(now);
  const weekStart = getWeekStart(now);
  const rec = purchases[itemId] || { weekly: 0, daily: 0, lastDay: "", lastWeek: "" };

  const weeklyUsed = rec.lastWeek === weekStart ? rec.weekly : 0;
  const dailyUsed = rec.lastDay === today ? rec.daily : 0;

  const weeklyLeft = limit.weeklyMax - weeklyUsed;
  const dailyLeft = limit.dailyRestock > 0 ? limit.dailyRestock - dailyUsed : weeklyLeft;
  const available = Math.min(weeklyLeft, dailyLeft);

  return {
    available: Math.max(0, available),
    dailyLeft: Math.max(0, dailyLeft),
    weeklyLeft: Math.max(0, weeklyLeft),
  };
}
