/**
 * Water Well mechanic.
 *
 * Each Water Well supports a limited number of crop plots.
 * Without enough wells, extra plots cannot be planted on.
 *
 * Base: 5 plots work without any well (starter plots).
 * Each Well adds +8 supported plots.
 */

export const BASE_PLOTS_WITHOUT_WELL = 5;
export const PLOTS_PER_WELL = 8;

/** How many plots the player can actively use given their well count. */
export function maxActivePlots(wellCount: number): number {
  return BASE_PLOTS_WITHOUT_WELL + wellCount * PLOTS_PER_WELL;
}

/** Count total plot cells on the map. */
export function countPlots(cells: Record<string, { type: string }>): number {
  return Object.values(cells).filter((c) => c.type === "plot").length;
}

/** Check if a specific plot can be used (has water). */
export function isPlotWatered(
  plotIndex: number,
  wellCount: number,
): boolean {
  return plotIndex < maxActivePlots(wellCount);
}
