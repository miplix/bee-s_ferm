import type { GameState, AnimalState } from "../../domain/types/game";
import type { AnimalKind } from "../../domain/types/ids";
import { ANIMAL_COSTS, getAnimalLevel, ANIMAL_CAPACITY } from "../../data/animals.data";
import { isReady } from "../../domain/time/time";
import { getActiveBoosts } from "../../domain/skills/skillEngine";
import { skillEffectsToBoosts, aggregateBoosts, applyBoost } from "../../domain/boosts/engine";
import { mulberry32 } from "../../domain/rng/prng";
import { buildSeed } from "../../domain/rng/seed";
import { rollAnimalMutant } from "../../domain/mutants/mutants";
import { log } from "../../lib/log";

const CURE_COST: Record<string, number> = { lemon: 1, honey: 1 };

/** Buy a new animal. */
export function buyAnimal(
  state: GameState,
  kind: AnimalKind,
  now: number,
): GameState {
  const spec = ANIMAL_COSTS[kind];

  // Must have the building
  if (!state.buildings.includes(spec.building as any)) return state;

  // Check capacity using building level
  const buildingLevel = state.buildingLevels?.[spec.building] ?? 1;
  // Barn is shared between cows and sheep
  const currentCount = spec.building === "barn"
    ? state.animals.filter((a) => a.kind === "cow" || a.kind === "sheep").length
    : state.animals.filter((a) => a.kind === kind).length;
  if (currentCount >= ANIMAL_CAPACITY(buildingLevel)) return state;

  // Check coins
  if (state.coins < spec.coins - 0.001) return state;

  const animal: AnimalState = {
    id: crypto.randomUUID(),
    kind,
    xp: 0,
    bornAt: now,
    lastFed: 0,
    lastCollect: 0,
    diseased: false,
  };

  return {
    ...state,
    coins: parseFloat((state.coins - spec.coins).toFixed(4)),
    animals: [...state.animals, animal],
    lastMeaningfulActivity: now,
  };
}

/** Feed an animal. Consumes wheat from inventory. */
export function feedAnimal(
  state: GameState,
  animalId: string,
  now: number,
): GameState {
  const idx = state.animals.findIndex((a) => a.id === animalId);
  if (idx < 0) return state;

  const animal = state.animals[idx];
  const levelDef = getAnimalLevel(animal.kind, animal.xp);

  // Must not be already producing
  if (animal.lastFed > 0 && !isReady(animal.lastFed, levelDef.productionMs, now)) {
    return state;
  }

  // Check feed (wheat for now)
  const feedId = "wheat";
  const feedCount = state.inventory[feedId] ?? 0;
  if (feedCount < levelDef.feedCost) return state;

  const inv = { ...state.inventory };
  inv[feedId] = feedCount - levelDef.feedCost;
  if (inv[feedId]! <= 0) delete inv[feedId];

  const newAnimals = [...state.animals];
  newAnimals[idx] = {
    ...animal,
    lastFed: now,
    xp: animal.xp + 10, // base XP per feeding
  };

  return {
    ...state,
    inventory: inv,
    animals: newAnimals,
    lastMeaningfulActivity: now,
  };
}

/** Collect produce from an animal. */
export function collectAnimal(
  state: GameState,
  animalId: string,
  now: number,
): GameState {
  const idx = state.animals.findIndex((a) => a.id === animalId);
  if (idx < 0) return state;

  const animal = state.animals[idx];
  if (animal.lastFed === 0) return state;

  const levelDef = getAnimalLevel(animal.kind, animal.xp);
  if (!isReady(animal.lastFed, levelDef.productionMs, now)) return state;

  const inv = { ...state.inventory };
  const product = levelDef.product;
  let amount = levelDef.amount;

  // Apply animal product boosts from skills
  const skillEffects = getActiveBoosts(state.skills);
  const boosts = aggregateBoosts(skillEffectsToBoosts(skillEffects));
  // Apply product-specific boost (e.g. "animal_products:egg") then general "animal_products"
  amount = applyBoost(amount, `animal_products:${product}`, boosts);
  amount = applyBoost(amount, "animal_products", boosts);

  // Diseased animals produce half (TZ 7.3)
  if (animal.diseased) amount = Math.max(1, Math.floor(amount / 2));

  const finalAmount = Math.floor(amount);
  inv[product] = (inv[product] ?? 0) + finalAmount;

  // Mutant roll using seeded PRNG
  const seed = buildSeed(state.seed, now, `mutant:animal:${animalId}:${now}`);
  const rng = mulberry32(seed);
  const mutant = rollAnimalMutant(rng, animal.kind);
  if (mutant) {
    inv[mutant.mutantId] = (inv[mutant.mutantId] ?? 0) + mutant.bonus;
  }

  const newAnimals = [...state.animals];
  newAnimals[idx] = {
    ...animal,
    lastFed: 0,
    lastCollect: now,
  };

  return {
    ...state,
    inventory: inv,
    animals: newAnimals,
    lastMeaningfulActivity: now,
  };
}

/** Cure a diseased animal (costs 1 lemon + 1 honey). */
export function cureAnimal(
  state: GameState,
  animalId: string,
): GameState {
  const idx = state.animals.findIndex((a) => a.id === animalId);
  if (idx < 0) return state;

  const animal = state.animals[idx];
  if (!animal.diseased) return state;

  // Check resources
  for (const [item, qty] of Object.entries(CURE_COST)) {
    if ((state.inventory[item] ?? 0) < qty) {
      log.warn("cureAnimal: missing ingredient", { item, have: state.inventory[item] ?? 0, need: qty });
      return state;
    }
  }

  const inv = { ...state.inventory };
  for (const [item, qty] of Object.entries(CURE_COST)) {
    inv[item] = (inv[item] ?? 0) - qty;
    if (inv[item]! <= 0) delete inv[item];
  }

  const newAnimals = [...state.animals];
  newAnimals[idx] = { ...animal, diseased: false };

  return { ...state, inventory: inv, animals: newAnimals };
}

/** Sell an animal for coins. */
export function sellAnimal(
  state: GameState,
  animalId: string,
): GameState {
  const idx = state.animals.findIndex((a) => a.id === animalId);
  if (idx < 0) return state;

  const animal = state.animals[idx];
  const base = ANIMAL_COSTS[animal.kind].coins;
  // Diseased sells for 25% less (TZ 7.3)
  const price = animal.diseased ? base * 0.75 : base;

  return {
    ...state,
    coins: parseFloat((state.coins + price * 0.5).toFixed(4)), // sell at 50% buy price
    animals: state.animals.filter((_, i) => i !== idx),
  };
}
