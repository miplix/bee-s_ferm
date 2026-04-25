// Weekly login bonus — replaces the daily reward.
// Random bonus scaled by player level. Once per ISO week.
// Daily rewards moved to future VIP/subscription tier.

export interface WeeklyBonus {
  coins: number;
  itemId: string | null;
  itemQty: number;
}

/** Get ISO week id like "2026-W17" — used as the claim key. */
export function isoWeekKey(now: number): string {
  const d = new Date(now);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * Roll the weekly bonus for a given level using a deterministic seeded RNG
 * keyed on (week, level) so the popup shows the same numbers across renders
 * within a week, but varies between weeks and players.
 */
export function rollWeeklyBonus(level: number, weekKey: string): WeeklyBonus {
  // Cheap seeded LCG from week+level
  let seed = 2166136261;
  const s = `${weekKey}:${level}`;
  for (let i = 0; i < s.length; i++) seed = Math.imul(seed ^ s.charCodeAt(i), 16777619);
  const rng = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 0x85ebca6b);
    seed = Math.imul(seed ^ (seed >>> 13), 0xc2b2ae35);
    return ((seed ^ (seed >>> 16)) >>> 0) / 0xffffffff;
  };

  // Coins: base 100 + level × 30 ± 40% variance
  const base = 100 + level * 30;
  const coins = Math.round(base * (0.6 + rng() * 0.8));

  // Random seed item from a pool — higher level unlocks better seeds
  const pool = [
    { itemId: "sunflower_seed", qtyMin: 5,  qtyMax: 15 },
    { itemId: "potato_seed",    qtyMin: 3,  qtyMax: 10 },
    { itemId: "carrot_seed",    qtyMin: 2,  qtyMax: 8 },
    { itemId: "pumpkin_seed",   qtyMin: 2,  qtyMax: 6, minLevel: 2 },
    { itemId: "cabbage_seed",   qtyMin: 2,  qtyMax: 5, minLevel: 3 },
    { itemId: "wheat_seed",     qtyMin: 2,  qtyMax: 5, minLevel: 5 },
    { itemId: "kale_seed",      qtyMin: 1,  qtyMax: 3, minLevel: 9 },
  ].filter((p) => (p.minLevel ?? 1) <= level);

  const pick = pool[Math.floor(rng() * pool.length)];
  const qtyRange = pick.qtyMax - pick.qtyMin;
  const itemQty = pick.qtyMin + Math.floor(rng() * (qtyRange + 1));

  return { coins, itemId: pick.itemId, itemQty };
}
