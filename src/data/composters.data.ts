/**
 * Composter definitions — 3 tiers of composters.
 * Each takes crop inputs and produces fertilizer + optional worm.
 */

export interface ComposterDef {
  id: string;
  name: string;
  emoji: string;
  level: number;                     // bumpkin level to unlock
  buildCost: Record<string, number>;
  processTimeMs: number;             // time to compost
  input: Record<string, number>;     // ingredients consumed
  output: { fertilizer: string; qty: number; worm?: string };
}

const _composters: ComposterDef[] = [
  {
    id: "compost_bin",
    name: "Compost Bin",
    emoji: "\uD83D\uDDD1\uFE0F",
    level: 7,
    buildCost: { wood: 5, stone: 5 },
    processTimeMs: 6 * 3600_000,
    input: { sunflower: 5, potato: 3 },
    output: { fertilizer: "sprout_mix", qty: 10, worm: "earthworm" },
  },
  {
    id: "turbo_composter",
    name: "Turbo Composter",
    emoji: "\u26A1",
    level: 12,
    buildCost: { wood: 50, stone: 25 },
    processTimeMs: 8 * 3600_000,
    input: { cabbage: 5, carrot: 3 },
    output: { fertilizer: "fruitful_blend", qty: 3, worm: "grub" },
  },
  {
    id: "premium_composter",
    name: "Premium Composter",
    emoji: "\uD83D\uDC8E",
    level: 18,
    buildCost: { gold: 50 },
    processTimeMs: 12 * 3600_000,
    input: { kale: 5, wheat: 5 },
    output: { fertilizer: "rapid_root", qty: 10, worm: "red_wiggler" },
  },
];
export const COMPOSTERS: readonly ComposterDef[] = _composters;

/** Lookup composter by ID. */
export function getComposterDef(id: string): ComposterDef | undefined {
  return COMPOSTERS.find((c) => c.id === id);
}

// ── Fertilizer effect definitions ──

export interface FertilizerDef {
  id: string;
  name: string;
  description: string;
  effect: {
    type: "flat_yield" | "flat_fruit_yield" | "speed_up";
    value: number;   // flat bonus or fraction (0.5 = -50% remaining time)
  };
}

const _fertilizers: FertilizerDef[] = [
  {
    id: "sprout_mix",
    name: "Sprout Mix",
    description: "+0.2 crop yield when applied to plot",
    effect: { type: "flat_yield", value: 0.2 },
  },
  {
    id: "fruitful_blend",
    name: "Fruitful Blend",
    description: "+0.2 fruit yield when applied to plot",
    effect: { type: "flat_fruit_yield", value: 0.2 },
  },
  {
    id: "rapid_root",
    name: "Rapid Root",
    description: "-50% remaining grow time",
    effect: { type: "speed_up", value: 0.5 },
  },
];
export const FERTILIZERS: readonly FertilizerDef[] = _fertilizers;

/** Lookup fertilizer by ID. */
export function getFertilizerDef(id: string): FertilizerDef | undefined {
  return FERTILIZERS.find((f) => f.id === id);
}
