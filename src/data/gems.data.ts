/**
 * Gems — premium currency data definitions.
 * Gems are used for speed-ups, omnifeed, shop restock, and instant construction.
 */

/** Cost in gems to instantly finish a timer based on remaining duration. */
export const SPEED_UP_COSTS: Record<string, number> = {
  "1min": 1,
  "5min": 2,
  "30min": 5,
  "1h": 10,
  "4h": 25,
  "8h": 35,
  "24h": 70,
  "48h": 100,
};

/** Ordered thresholds in ms for speed-up cost lookup. */
const SPEED_UP_THRESHOLDS: { maxMs: number; cost: number }[] = [
  { maxMs: 1 * 60_000, cost: 1 },
  { maxMs: 5 * 60_000, cost: 2 },
  { maxMs: 30 * 60_000, cost: 5 },
  { maxMs: 1 * 3_600_000, cost: 10 },
  { maxMs: 4 * 3_600_000, cost: 25 },
  { maxMs: 8 * 3_600_000, cost: 35 },
  { maxMs: 24 * 3_600_000, cost: 70 },
  { maxMs: 48 * 3_600_000, cost: 100 },
];

/**
 * Calculate gem cost to skip a remaining duration (ms).
 * Finds the smallest threshold that covers the remaining time.
 */
export function getSpeedUpCost(remainingMs: number): number {
  if (remainingMs <= 0) return 0;
  for (const t of SPEED_UP_THRESHOLDS) {
    if (remainingMs <= t.maxMs) return t.cost;
  }
  // Beyond 48h — scale linearly: 100 gems per 48h
  return Math.ceil((remainingMs / (48 * 3_600_000)) * 100);
}

/** Cost to buy one omnifeed (feeds any animal). */
export const OMNIFEED_GEM_COST = 1;

/** Cost to restock daily shop limits. */
export const RESTOCK_SHOP_GEM_COST = 20;
