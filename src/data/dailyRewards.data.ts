// Daily login rewards — 7-day cycle, streak resets on missed day.

export interface DailyRewardDef {
  day: number;              // 1-7
  label: string;
  items: { itemId: string; qty: number }[];
  coins: number;
}

export const DAILY_REWARDS: readonly DailyRewardDef[] = Object.freeze([
  { day: 1, label: "Day 1",                items: [],                                       coins: 10 },
  { day: 2, label: "Day 2",                items: [],                                       coins: 20 },
  { day: 3, label: "Day 3 - Seeds!",       items: [{ itemId: "sunflower_seed", qty: 10 }],  coins: 0 },
  { day: 4, label: "Day 4",                items: [],                                       coins: 50 },
  { day: 5, label: "Day 5 - Tools!",       items: [{ itemId: "axe", qty: 3 }],              coins: 0 },
  { day: 6, label: "Day 6",                items: [],                                       coins: 100 },
  { day: 7, label: "Day 7 - MEGA!",        items: [
    { itemId: "sunflower_seed", qty: 5 },
    { itemId: "potato_seed", qty: 5 },
    { itemId: "carrot_seed", qty: 5 },
    { itemId: "pumpkin_seed", qty: 5 },
    { itemId: "cabbage_seed", qty: 5 },
  ], coins: 200 },
]);

/** Max streak length before cycling back to day 1. */
export const MAX_STREAK = 7;
