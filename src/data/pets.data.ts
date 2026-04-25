/**
 * Pets — passive boost companions placed on the farm.
 */

export interface PetDef {
  id: string;
  name: string;
  emoji: string;
  boost: { type: "flat" | "mult"; target: string; value: number };
  obtainedFrom: string;
}

export const PETS: PetDef[] = [
  {
    id: "farm_dog",
    name: "Farm Dog",
    emoji: "\u{1F415}",
    boost: { type: "mult", target: "animal_sleep", value: -0.10 },
    obtainedFrom: "delivery",
  },
  {
    id: "lucky_cat",
    name: "Lucky Cat",
    emoji: "\u{1F431}",
    boost: { type: "mult", target: "rare_fish", value: 0.05 },
    obtainedFrom: "shop",
  },
  {
    id: "garden_gnome",
    name: "Garden Gnome",
    emoji: "\u{1F9D9}",
    boost: { type: "mult", target: "crop_grow", value: -0.05 },
    obtainedFrom: "craft",
  },
  {
    id: "mining_mole",
    name: "Mining Mole",
    emoji: "\u{1F439}",
    boost: { type: "mult", target: "ore_yield", value: 0.10 },
    obtainedFrom: "delivery",
  },
  {
    id: "honey_bear",
    name: "Honey Bear",
    emoji: "\u{1F43B}",
    boost: { type: "mult", target: "honey_production", value: 0.20 },
    obtainedFrom: "reward",
  },
];

/** Lookup pet definition by id. */
export function getPetDef(id: string): PetDef | undefined {
  return PETS.find((p) => p.id === id);
}

// --- Pet XP system ---

/** Nap cooldown: 4 hours. */
export const PET_NAP_COOLDOWN_MS = 4 * 3_600_000;

/** XP gained per nap. */
export const PET_XP_PER_NAP = 10;

/** XP gained per feeding (1 wheat). */
export const PET_FEED_XP = 5;

/** Feed cost per session. */
export const PET_FEED_COST: Record<string, number> = { wheat: 1 };

export interface PetLevelDef {
  level: number;
  xpRequired: number;
  boostMultiplier: number; // multiplier applied on top of pet's base boost
}

export const PET_LEVELS: PetLevelDef[] = [
  { level: 1, xpRequired: 0,   boostMultiplier: 1.00 },
  { level: 2, xpRequired: 50,  boostMultiplier: 1.25 },
  { level: 3, xpRequired: 150, boostMultiplier: 1.50 },
  { level: 4, xpRequired: 300, boostMultiplier: 1.75 },
  { level: 5, xpRequired: 500, boostMultiplier: 2.00 },
];

export function getPetLevel(xp: number): PetLevelDef {
  let result = PET_LEVELS[0];
  for (const def of PET_LEVELS) {
    if (xp >= def.xpRequired) result = def;
  }
  return result;
}

export function getPetLevelProgress(xp: number): number {
  const cur = getPetLevel(xp);
  const nextIdx = cur.level; // PET_LEVELS is 1-indexed, so next is cur.level (0-based idx)
  const next = PET_LEVELS[nextIdx];
  if (!next) return 1; // max level
  return (xp - cur.xpRequired) / (next.xpRequired - cur.xpRequired);
}
