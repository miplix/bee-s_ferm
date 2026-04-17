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
