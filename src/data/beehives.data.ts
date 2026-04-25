/**
 * Beehive constants (custom mechanics from user spec + TZ 9).
 * Beehives unlock ONLY after Spring Island transition.
 * Demo beehive counts toward the 15-slot limit.
 */

/** Cost to buy a Lv1 beehive (pollen). */
export const BEEHIVE_LV1_COST = 1000;

/** Demo beehive passive pollen accrual per day. */
export const DEMO_POLLEN_PER_DAY = 0.4;

/** Lv1 beehive pollen production per day. */
export const LV1_POLLEN_PER_DAY = 5;

/** Demo beehive action interval (8 hours). */
export const DEMO_ACTION_INTERVAL_MS = 8 * 3600_000;

/** Max actions per day for demo beehive. */
export const DEMO_MAX_ACTIONS_PER_DAY = 3;

/** Actions needed to upgrade demo → Lv1. */
export const DEMO_UPGRADE_ACTIONS = 1000;

/** Instant upgrade cost in pollen (pay for remaining actions). */
export const DEMO_INSTANT_UPGRADE_COST = 1000;

/** Passive boost to crops in radius per beehive level. */
export const BEEHIVE_BOOST_PER_LEVEL: Record<number, number> = {
  0: 0.01,   // demo: +1%
  1: 0.10,   // Lv1: +10%
  2: 0.15,   // Lv2: +15%
  3: 0.20,   // Lv3: +20%
  4: 0.25,
  5: 0.30,
};

/** Merge penalty: output = sum * (1 - MERGE_PENALTY). */
export const MERGE_PENALTY = 0.10;

/** Beehive boost radius (1 cell = 12 neighbors for 2x2 hive, simplified to Manhattan <=1). */
export const BEEHIVE_RADIUS = 1;

/** Per-level upgrade cost and pollen production. */
export const BEEHIVE_LEVELS: Record<number, { upgradeCost: number; pollenPerDay: number }> = {
  1: { upgradeCost: 0,     pollenPerDay: 5  },
  2: { upgradeCost: 5000,  pollenPerDay: 12 },
  3: { upgradeCost: 20000, pollenPerDay: 30 },
};

export const BEEHIVE_MAX_LEVEL = 3;
