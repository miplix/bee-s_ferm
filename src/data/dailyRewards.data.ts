// Daily login bonus — small rewards, streak resets on a missed day.
// Player picks ONE resource from a 3-5 option menu per day.

export type RewardKind = "coins" | "wheat" | "tool" | "basic_seed" | "advanced_seed";

export interface RewardOption {
  kind: RewardKind;
  itemId: string;       // specific itemId (e.g. "sunflower_seed", "axe", "coins")
  qty: number;
  label: string;        // user-facing label (RU)
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
 * Build the choice menu for a given streak day.
 * Caps (per user spec):
 * - coins:        ≤ 10
 * - wheat:        ≤ 10
 * - basic seeds:  ≤ 100  (sunflower / potato / carrot)
 * - advanced:     ≤ 20   (zucchini and above)
 * - tools:        ≤ 3    (only after streak ≥ 7)
 * After day 30, all caps × 2 (rough scaling — placeholder for richer monthly tier).
 */
export function getDailyChoices(streakDay: number): RewardOption[] {
  const monthly = streakDay > 30 ? 2 : 1;
  const opts: RewardOption[] = [
    { kind: "coins",       itemId: "coins",          qty: Math.min(10 * monthly, 20),  label: `${10 * monthly} монет` },
    { kind: "wheat",       itemId: "wheat",          qty: Math.min(10 * monthly, 20),  label: `${10 * monthly} пшеницы` },
    { kind: "basic_seed",  itemId: "sunflower_seed", qty: Math.min(50 * monthly, 100), label: `${50 * monthly} семян подсолнуха` },
    { kind: "basic_seed",  itemId: "potato_seed",    qty: Math.min(30 * monthly, 60),  label: `${30 * monthly} семян картофеля` },
    { kind: "basic_seed",  itemId: "carrot_seed",    qty: Math.min(20 * monthly, 40),  label: `${20 * monthly} семян моркови` },
  ];
  // Advanced seeds unlock at streak 3+
  if (streakDay >= 3) {
    opts.push({ kind: "advanced_seed", itemId: "zucchini_seed", qty: Math.min(10 * monthly, 20), label: `${10 * monthly} семян цукини` });
  }
  if (streakDay >= 5) {
    opts.push({ kind: "advanced_seed", itemId: "cabbage_seed", qty: Math.min(10 * monthly, 20), label: `${10 * monthly} семян капусты` });
  }
  // Tools unlock at streak 7+
  if (streakDay >= 7) {
    opts.push({ kind: "tool", itemId: "axe", qty: Math.min(2 * monthly, 3), label: `${2 * monthly} топор` });
    opts.push({ kind: "tool", itemId: "stone_pickaxe", qty: Math.min(2 * monthly, 3), label: `${2 * monthly} деревянная кирка` });
  }
  return opts;
}
