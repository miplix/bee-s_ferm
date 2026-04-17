import type { Season } from "../types/ids";

/** Each season lasts 7 real days. */
export const SEASON_DURATION_MS = 7 * 24 * 3600_000;

/** Season cycle order. */
export const SEASON_ORDER: readonly Season[] = ["spring", "summer", "autumn", "winter"];

/**
 * Get current season based on a reference epoch.
 * Season 0 (spring) starts at epoch 0 (or a configurable anchor).
 * Cycle: spring → summer → autumn → winter → spring ...
 */
export function getCurrentSeason(now: number, anchor = 0): Season {
  const elapsed = now - anchor;
  const cycleMs = SEASON_ORDER.length * SEASON_DURATION_MS; // 28 days full cycle
  const posInCycle = ((elapsed % cycleMs) + cycleMs) % cycleMs; // handle negative
  const seasonIdx = Math.floor(posInCycle / SEASON_DURATION_MS);
  return SEASON_ORDER[seasonIdx];
}

/** Days remaining in current season. */
export function daysLeftInSeason(now: number, anchor = 0): number {
  const elapsed = now - anchor;
  const posInSeason = ((elapsed % SEASON_DURATION_MS) + SEASON_DURATION_MS) % SEASON_DURATION_MS;
  return Math.ceil((SEASON_DURATION_MS - posInSeason) / (24 * 3600_000));
}

/** Check if a crop's season list includes the current season. */
export function isCropInSeason(
  cropSeasons: Season[] | "all",
  currentSeason: Season,
): boolean {
  if (cropSeasons === "all") return true;
  return cropSeasons.includes(currentSeason);
}

/** Season display info. */
export const SEASON_INFO: Record<Season, { name: string; emoji: string; color: string }> = {
  spring: { name: "Spring", emoji: "🌸", color: "text-green-400" },
  summer: { name: "Summer", emoji: "☀️", color: "text-yellow-400" },
  autumn: { name: "Autumn", emoji: "🍂", color: "text-orange-400" },
  winter: { name: "Winter", emoji: "❄️", color: "text-blue-400" },
};
