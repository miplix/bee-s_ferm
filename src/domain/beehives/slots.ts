import type { IslandId } from "../types/ids";

/**
 * Maximum beehive slots available at a given Bumpkin level and island.
 * Beehives only unlock after transitioning to Spring Island.
 * Slots persist when moving to Desert/Volcano.
 *
 * Custom table (user spec, NOT SFL):
 *   10-14: 1,  15-24: 2,  25-29: 3,  30-34: 4,  35-39: 5,
 *   40-44: 6,  45-49: 7,  50-74: 8,  75-99: 9,  100-119: 10,
 *   120-139: 11,  140-159: 12,  160-179: 13,  180-199: 14,  200: 15
 */
export function maxBeehiveSlots(level: number, island: IslandId, vipActive = false): number {
  // Beehives are NOT available on Basic Island
  if (island === "basic") return 0;

  let slots: number;
  if (level < 10) slots = 0;
  else if (level < 15) slots = 1;
  else if (level < 25) slots = 2;
  else if (level < 30) slots = 3;
  else if (level < 35) slots = 4;
  else if (level < 40) slots = 5;
  else if (level < 45) slots = 6;
  else if (level < 50) slots = 7;
  else if (level < 75) slots = 8;
  else if (level < 100) slots = 9;
  else if (level < 120) slots = 10;
  else if (level < 140) slots = 11;
  else if (level < 160) slots = 12;
  else if (level < 180) slots = 13;
  else if (level < 200) slots = 14;
  else slots = 15;

  // VIP grants +1 extra slot while active
  if (vipActive && slots > 0) slots += 1;

  return slots;
}

/**
 * Base (non-VIP) slots — used to determine which beehives become inactive
 * if VIP expires while user has more than base slots.
 */
export function baseBeehiveSlots(level: number, island: IslandId): number {
  return maxBeehiveSlots(level, island, false);
}
