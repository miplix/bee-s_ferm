/**
 * Collectibles — placeable farm items that provide passive boosts.
 * MVP set: 10 collectibles with various boost effects.
 */

export interface CollectibleBoost {
  type: "flat" | "mult";
  target: string;   // boost engine target: "crop_grow", "wood", "stone", etc.
  value: number;
}

export interface CollectibleDef {
  id: string;
  name: string;
  emoji: string;
  boosts: CollectibleBoost[];
  obtainedFrom: "craft" | "shop" | "delivery" | "reward";
}

export const COLLECTIBLES: CollectibleDef[] = [
  {
    id: "basic_scarecrow",
    name: "Basic Scarecrow",
    emoji: "🧑‍🌾",
    boosts: [{ type: "mult", target: "crop_grow", value: -0.20 }],
    obtainedFrom: "craft",
  },
  {
    id: "woody_beaver",
    name: "Woody the Beaver",
    emoji: "🦫",
    boosts: [{ type: "flat", target: "wood", value: 0.2 }],
    obtainedFrom: "craft",
  },
  {
    id: "rocky_mole",
    name: "Rocky the Mole",
    emoji: "🐿️",
    boosts: [{ type: "flat", target: "stone", value: 0.2 }],
    obtainedFrom: "delivery",
  },
  {
    id: "nugget",
    name: "Nugget",
    emoji: "🪙",
    boosts: [{ type: "flat", target: "gold", value: 0.1 }],
    obtainedFrom: "delivery",
  },
  {
    id: "nancy",
    name: "Nancy",
    emoji: "🌻",
    boosts: [{ type: "mult", target: "crop_grow", value: -0.15 }],
    obtainedFrom: "reward",
  },
  {
    id: "rich_chicken",
    name: "Rich Chicken",
    emoji: "🐔",
    boosts: [{ type: "flat", target: "animal_products:egg", value: 0.1 }],
    obtainedFrom: "delivery",
  },
  {
    id: "fat_chicken",
    name: "Fat Chicken",
    emoji: "🍗",
    boosts: [
      { type: "flat", target: "animal_products:egg", value: 0.1 },
      { type: "mult", target: "animal_speed", value: -0.10 },
    ],
    obtainedFrom: "craft",
  },
  {
    id: "speed_chicken",
    name: "Speed Chicken",
    emoji: "⚡",
    boosts: [{ type: "mult", target: "animal_cooldown:chicken", value: -0.10 }],
    obtainedFrom: "craft",
  },
  {
    id: "lunar_calendar",
    name: "Lunar Calendar",
    emoji: "🌙",
    boosts: [{ type: "mult", target: "crop_grow", value: -0.10 }],
    obtainedFrom: "shop",
  },
  {
    id: "maneki_neko",
    name: "Maneki Neko",
    emoji: "🐱",
    boosts: [{ type: "mult", target: "sell_price", value: 0.10 }],
    obtainedFrom: "shop",
  },
];

/** Lookup collectible definition by id. */
export function getCollectibleDef(id: string): CollectibleDef | undefined {
  return COLLECTIBLES.find((c) => c.id === id);
}

// ── Time Warp Totems ──

export interface TotemDef {
  id: string;
  name: string;
  emoji: string;
  durationMs: number;
  cooldownMult: number;  // multiplier applied to all timer durations (0.5 = halved)
}

export const TOTEMS: TotemDef[] = [
  {
    id: "time_warp_totem",
    name: "Time Warp Totem",
    emoji: "⏳",
    durationMs: 2 * 60 * 60 * 1000,  // 2 hours
    cooldownMult: 0.5,
  },
  {
    id: "super_totem",
    name: "Super Totem",
    emoji: "⌛",
    durationMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
    cooldownMult: 0.5,
  },
];

export function getTotemDef(id: string): TotemDef | undefined {
  return TOTEMS.find((t) => t.id === id);
}
