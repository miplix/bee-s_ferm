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
export function maxBeehiveSlots(level: number, island: IslandId): number {
  // Beehives are NOT available on Basic Island
  if (island === "basic") return 0;

  if (level < 10) return 0;
  if (level < 15) return 1;
  if (level < 25) return 2;
  if (level < 30) return 3;
  if (level < 35) return 4;
  if (level < 40) return 5;
  if (level < 45) return 6;
  if (level < 50) return 7;
  if (level < 75) return 8;
  if (level < 100) return 9;
  if (level < 120) return 10;
  if (level < 140) return 11;
  if (level < 160) return 12;
  if (level < 180) return 13;
  if (level < 200) return 14;
  return 15;
}
