/**
 * Factions — player joins ONE faction (irreversible) for passive boosts.
 */

export interface FactionDef {
  id: string;
  name: string;
  emoji: string;
  boost: { type: "flat" | "mult"; target: string; value: number };
  description: string;
}

export const FACTIONS: FactionDef[] = [
  {
    id: "bumpkin",
    name: "Bumpkin",
    emoji: "\u{1F9D1}\u200D\u{1F33E}",
    boost: { type: "mult", target: "crop_yield", value: 0.10 },
    description: "+10% crop yield",
  },
  {
    id: "goblin",
    name: "Goblin",
    emoji: "\u{1F47A}",
    boost: { type: "mult", target: "resource_yield", value: 0.10 },
    description: "+10% resource yield (wood, stone, ore)",
  },
  {
    id: "sunflorian",
    name: "Sunflorian",
    emoji: "\u{1F33B}",
    boost: { type: "mult", target: "sell_price", value: 0.10 },
    description: "+10% coins from sales",
  },
  {
    id: "nightshade",
    name: "Nightshade",
    emoji: "\u{1F319}",
    boost: { type: "mult", target: "all_cooldowns", value: -0.10 },
    description: "-10% all cooldowns",
  },
];

/** Lookup faction definition by id. */
export function getFactionDef(id: string): FactionDef | undefined {
  return FACTIONS.find((f) => f.id === id);
}
