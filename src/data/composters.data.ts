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
//
// Time-based multipliers are PRORATED at harvest by the fraction of grow time
// the cell was under boost (same model as pollen boost). One-shot effects
// (speed_up) apply immediately and don't need a timer.

export const FERTILIZER_DURATION_MS = 12 * 3600_000;  // 12h, same as pollen boost

export interface FertilizerDef {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  effect: {
    /**
     * yield_mult       — multiplicative yield boost on plot crops, prorated by time
     * fruit_yield_mult — multiplicative yield boost on fruit_patch, prorated by time
     * speed_up         — one-shot reduction of remaining grow time (no timer)
     */
    type: "yield_mult" | "fruit_yield_mult" | "speed_up";
    value: number;       // ×multiplier (1.5 = +50%) or fraction (0.5 = -50% remaining)
    durationMs?: number; // only for time-based effects
  };
}

const _fertilizers: FertilizerDef[] = [
  {
    id: "sprout_mix",
    name: "Sprout Mix",
    nameRu: "Удобрение «Росток»",
    description: "×1.5 урожай с грядки в течение 12ч (пропорционально времени роста)",
    effect: { type: "yield_mult", value: 1.5, durationMs: FERTILIZER_DURATION_MS },
  },
  {
    id: "fruitful_blend",
    name: "Fruitful Blend",
    nameRu: "Удобрение «Изобилие»",
    description: "×2 урожай с фруктового куста в течение 12ч (пропорционально времени роста)",
    effect: { type: "fruit_yield_mult", value: 2.0, durationMs: FERTILIZER_DURATION_MS },
  },
  {
    id: "rapid_root",
    name: "Rapid Root",
    nameRu: "Удобрение «Корнерост»",
    description: "−50% оставшегося времени роста (одноразово при применении)",
    effect: { type: "speed_up", value: 0.5 },
  },
];
export const FERTILIZERS: readonly FertilizerDef[] = _fertilizers;

/** Lookup fertilizer by ID. */
export function getFertilizerDef(id: string): FertilizerDef | undefined {
  return FERTILIZERS.find((f) => f.id === id);
}
