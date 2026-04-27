// Daily login bonus — RANDOM reward, weighted by inverse coin value.
// Cheaper items have higher chance, rare items rare.

export type RewardKind = "coins" | "wheat" | "tool" | "basic_seed" | "advanced_seed";

export interface RewardOption {
  kind: RewardKind;
  itemId: string;       // specific itemId (e.g. "sunflower_seed", "axe", "coins")
  qty: number;
  label: string;        // user-facing label (RU)
  unitValue: number;    // coin-equivalent value of ONE unit
}

/** ISO date "YYYY-MM-DD" of given timestamp (UTC). */
export function isoDayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** ISO date of previous day. */
export function previousDayKey(now: number): string {
  return new Date(now - 86_400_000).toISOString().slice(0, 10);
}

/**
 * Pool of possible rewards for a streak day.
 * Caps (per user spec): coins/wheat ≤10, basic ≤100, advanced ≤20, tools ≤3.
 * Advanced unlocks at streak ≥3, tools at streak ≥7.
 * After day 30 — rewards × 2 (within hard caps).
 */
export function getRewardPool(streakDay: number): RewardOption[] {
  const m = streakDay > 30 ? 2 : 1;
  const cap = (n: number, max: number) => Math.min(n * m, max);

  const pool: RewardOption[] = [
    { kind: "coins",       itemId: "coins",          qty: cap(10, 20),   unitValue: 1.0,    label: `${cap(10, 20)} монет` },
    { kind: "wheat",       itemId: "wheat",          qty: cap(10, 20),   unitValue: 7.0,    label: `${cap(10, 20)} пшеницы` },
    { kind: "basic_seed",  itemId: "sunflower_seed", qty: cap(50, 100),  unitValue: 0.01,   label: `${cap(50, 100)} семян подсолнуха` },
    { kind: "basic_seed",  itemId: "potato_seed",    qty: cap(30, 60),   unitValue: 0.10,   label: `${cap(30, 60)} семян картофеля` },
    { kind: "basic_seed",  itemId: "carrot_seed",    qty: cap(20, 40),   unitValue: 0.50,   label: `${cap(20, 40)} семян моркови` },
  ];

  if (streakDay >= 3) {
    pool.push({ kind: "advanced_seed", itemId: "zucchini_seed", qty: cap(10, 20), unitValue: 0.70, label: `${cap(10, 20)} семян цукини` });
  }
  if (streakDay >= 5) {
    pool.push({ kind: "advanced_seed", itemId: "cabbage_seed",  qty: cap(10, 20), unitValue: 1.00, label: `${cap(10, 20)} семян капусты` });
  }
  if (streakDay >= 7) {
    pool.push({ kind: "tool", itemId: "axe",           qty: cap(2, 3), unitValue: 20.0, label: `${cap(2, 3)} топор` });
    pool.push({ kind: "tool", itemId: "stone_pickaxe", qty: cap(2, 3), unitValue: 12.0, label: `${cap(2, 3)} деревянная кирка` });
  }
  return pool;
}

/** Total coin-value of a reward option. */
export function rewardTotalValue(opt: RewardOption): number {
  return opt.qty * opt.unitValue;
}

/**
 * Pick a random reward from the pool, weighted INVERSELY by total coin-value.
 * Uses sqrt-softening so cheap rewards aren't 99% — gives rare items realistic chance.
 *
 * `seed` parameter ensures deterministic outcome per (date+player) — same player
 * sees same reward on the day even if popup is reopened.
 */
export function pickRandomReward(pool: RewardOption[], seed: number): { option: RewardOption; index: number } {
  // weight = 1 / sqrt(totalValue) — softer than raw 1/value
  const weights = pool.map((o) => 1 / Math.sqrt(Math.max(rewardTotalValue(o), 0.5)));
  const total = weights.reduce((a, b) => a + b, 0);

  // Mulberry32 — deterministic from seed
  let s = seed >>> 0;
  s = Math.imul(s ^ (s >>> 15), 0x85ebca6b);
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
  const rand = ((s ^ (s >>> 16)) >>> 0) / 0xffffffff;

  let acc = 0;
  const target = rand * total;
  for (let i = 0; i < pool.length; i++) {
    acc += weights[i];
    if (acc >= target) return { option: pool[i], index: i };
  }
  return { option: pool[pool.length - 1], index: pool.length - 1 };
}

/** Compute the chance (probability 0-1) for each option, for UI display. */
export function getProbabilities(pool: RewardOption[]): number[] {
  const weights = pool.map((o) => 1 / Math.sqrt(Math.max(rewardTotalValue(o), 0.5)));
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / total);
}
