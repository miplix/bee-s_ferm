/**
 * Мутанты — редкие случайные дропы при сборе урожая/продуктов.
 *
 * Шансы:
 *   - Crops:   1 / 1 000 000  per harvest  (0.000001)
 *   - Animals: 1 / 10 000     per collect  (0.0001)
 *
 * Бусты работают ТОЛЬКО когда мутант размещён на ферме (см. state.placedMutants).
 * Каждый размещённый мутант: +10 % к урожаю/продукту своей родительской культуры/животного.
 */

import type { PRNG } from "../rng/prng";
import { chance } from "../rng/prng";

// ── Crop mutants ──

export interface CropMutantDef {
  name: string;     // RU отображаемое имя
  chance: number;   // вероятность на сбор
  bonusPct: number; // бонус когда placed (0.10 = +10%)
}

export const CROP_MUTANTS: Record<string, CropMutantDef> = {
  sunflower: { name: "Звёздный подсолнух",   chance: 0.000001, bonusPct: 0.10 },
  potato:    { name: "Могучая картошка",      chance: 0.000001, bonusPct: 0.10 },
  pumpkin:   { name: "Радикальная тыква",     chance: 0.000001, bonusPct: 0.10 },
  carrot:    { name: "Космическая морковь",   chance: 0.000001, bonusPct: 0.10 },
  cabbage:   { name: "Колоссальная капуста",  chance: 0.000001, bonusPct: 0.10 },
  beetroot:  { name: "Богатая свёкла",        chance: 0.000001, bonusPct: 0.10 },
  corn:      { name: "Небесная кукуруза",     chance: 0.000001, bonusPct: 0.10 },
  wheat:     { name: "Чудо-пшеница",          chance: 0.000001, bonusPct: 0.10 },
};

// ── Animal mutants ──

export interface AnimalMutantDef {
  name: string;
  chance: number;
  bonusPct: number;
}

export const ANIMAL_MUTANTS: Record<string, AnimalMutantDef> = {
  chicken: { name: "Мутант-курица",  chance: 0.0001, bonusPct: 0.10 },
  cow:     { name: "Мутант-корова",  chance: 0.0001, bonusPct: 0.10 },
  sheep:   { name: "Мутант-овца",    chance: 0.0001, bonusPct: 0.10 },
};

/**
 * Бросок на crop-мутанта. Возвращает { mutantId } если повезло, иначе null.
 * Mutant id формируется как `mutant_<cropId>` — единый формат с inventory.
 */
export function rollCropMutant(rng: PRNG, cropId: string): { mutantId: string } | null {
  const def = CROP_MUTANTS[cropId];
  if (!def) return null;
  if (chance(rng, def.chance)) {
    return { mutantId: `mutant_${cropId}` };
  }
  return null;
}

/** Бросок на animal-мутанта. */
export function rollAnimalMutant(rng: PRNG, animalKind: string): { mutantId: string } | null {
  const def = ANIMAL_MUTANTS[animalKind];
  if (!def) return null;
  if (chance(rng, def.chance)) {
    return { mutantId: `mutant_${animalKind}` };
  }
  return null;
}

/** Lookup: имя мутанта на русском по его id. */
export function getMutantName(mutantId: string): string {
  const baseId = mutantId.replace("mutant_", "");
  return CROP_MUTANTS[baseId]?.name ?? ANIMAL_MUTANTS[baseId]?.name ?? mutantId;
}

/**
 * Суммарный множитель урожая для cropId, исходя из placedMutants.
 * Каждый размещённый mutant_<cropId> добавляет +10% к выходу (bonusPct).
 *
 * Мутанты можно размещать в нескольких экземплярах — бонусы складываются.
 * Возвращает множитель: 1.0 если ничего не размещено, 1.1 за один экземпляр и т.д.
 */
export function placedMutantCropMultiplier(
  cropId: string,
  placedMutants: readonly string[],
): number {
  const def = CROP_MUTANTS[cropId];
  if (!def) return 1;
  const targetId = `mutant_${cropId}`;
  const count = placedMutants.filter((id) => id === targetId).length;
  return 1 + count * def.bonusPct;
}

/** Аналогично для animal kind → множитель к продукту. */
export function placedMutantAnimalMultiplier(
  animalKind: string,
  placedMutants: readonly string[],
): number {
  const def = ANIMAL_MUTANTS[animalKind];
  if (!def) return 1;
  const targetId = `mutant_${animalKind}`;
  const count = placedMutants.filter((id) => id === targetId).length;
  return 1 + count * def.bonusPct;
}

/** Множество всех мутант-id (для фильтра в инвентаре, маркетплейсе). */
export function isMutantId(id: string): boolean {
  return id.startsWith("mutant_");
}
