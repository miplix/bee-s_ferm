/**
 * Mutants — rare crop/animal variants obtained via seeded PRNG rolls.
 */

import type { PRNG } from "../rng/prng";
import { chance } from "../rng/prng";

// ── Crop Mutants ──

export interface CropMutantDef {
  name: string;
  chance: number;   // probability per harvest (e.g. 0.03 = 3%)
  bonus: number;    // bonus items added to inventory
}

export const CROP_MUTANTS: Record<string, CropMutantDef> = {
  sunflower: { name: "Stellar Sunflower", chance: 0.03, bonus: 10 },
  potato:    { name: "Potent Potato",     chance: 0.03, bonus: 10 },
  pumpkin:   { name: "Radical Pumpkin",   chance: 0.03, bonus: 10 },
  carrot:    { name: "Cosmic Carrot",     chance: 0.03, bonus: 10 },
  cabbage:   { name: "Colossal Cabbage",  chance: 0.03, bonus: 10 },
  beetroot:  { name: "Bountiful Beetroot",chance: 0.03, bonus: 10 },
  corn:      { name: "Celestial Corn",    chance: 0.03, bonus: 10 },
  wheat:     { name: "Wonder Wheat",      chance: 0.03, bonus: 10 },
};

// ── Animal Mutants ──

export interface AnimalMutantDef {
  name: string;
  chance: number;   // probability per collection (e.g. 0.001 = 0.1%)
  bonus: number;    // bonus items added to inventory
}

export const ANIMAL_MUTANTS: Record<string, AnimalMutantDef> = {
  chicken: { name: "Mutant Chicken", chance: 0.001, bonus: 5 },
  cow:     { name: "Mutant Cow",     chance: 0.001, bonus: 5 },
  sheep:   { name: "Mutant Sheep",   chance: 0.001, bonus: 5 },
};

/**
 * Roll for a crop mutant. Returns the mutant item ID and bonus amount if successful,
 * or null if no mutant was obtained.
 */
export function rollCropMutant(
  rng: PRNG,
  cropId: string,
): { mutantId: string; bonus: number } | null {
  const def = CROP_MUTANTS[cropId];
  if (!def) return null;

  if (chance(rng, def.chance)) {
    // Mutant item ID is a snake_case version of the mutant name
    const mutantId = `mutant_${cropId}`;
    return { mutantId, bonus: def.bonus };
  }
  return null;
}

/**
 * Roll for an animal mutant. Returns the mutant item ID and bonus amount if successful,
 * or null if no mutant was obtained.
 */
export function rollAnimalMutant(
  rng: PRNG,
  animalKind: string,
): { mutantId: string; bonus: number } | null {
  const def = ANIMAL_MUTANTS[animalKind];
  if (!def) return null;

  if (chance(rng, def.chance)) {
    const mutantId = `mutant_${animalKind}`;
    return { mutantId, bonus: def.bonus };
  }
  return null;
}
