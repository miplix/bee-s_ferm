import type { GameState, PetState } from "../../domain/types/game";
import {
  getPetDef,
  PET_NAP_COOLDOWN_MS,
  PET_XP_PER_NAP,
  PET_FEED_XP,
  PET_FEED_COST,
} from "../../data/pets.data";
import { isReady } from "../../domain/time/time";
import { log } from "../../lib/log";

/** Adopt a pet. Requires Pet House building. */
export function adoptPet(
  state: GameState,
  petId: string,
  now: number,
): GameState {
  if (!getPetDef(petId)) return state;
  if (state.pets.includes(petId)) return state;

  if (!state.buildings.includes("pet_house" as any)) {
    log.warn("adoptPet: Pet House required");
    return state;
  }

  const petState: PetState = { id: petId, xp: 0, lastNap: 0, adoptedAt: now };

  return {
    ...state,
    pets: [...state.pets, petId],
    petStates: { ...state.petStates, [petId]: petState },
    lastMeaningfulActivity: now,
  };
}

/** Nap a pet: gain XP every 4 hours. */
export function napPet(
  state: GameState,
  petId: string,
  now: number,
): GameState {
  if (!state.pets.includes(petId)) return state;

  const ps = state.petStates[petId];
  if (!ps) return state;

  if (!isReady(ps.lastNap, PET_NAP_COOLDOWN_MS, now)) return state;

  return {
    ...state,
    petStates: {
      ...state.petStates,
      [petId]: { ...ps, xp: ps.xp + PET_XP_PER_NAP, lastNap: now },
    },
    lastMeaningfulActivity: now,
  };
}

/** Feed a pet: consumes wheat, grants XP immediately (no cooldown). */
export function feedPet(
  state: GameState,
  petId: string,
  now: number,
): GameState {
  if (!state.pets.includes(petId)) return state;

  const ps = state.petStates[petId];
  if (!ps) return state;

  for (const [item, qty] of Object.entries(PET_FEED_COST)) {
    if ((state.inventory[item] ?? 0) < qty) {
      log.warn("feedPet: missing ingredient", { item, have: state.inventory[item] ?? 0, need: qty });
      return state;
    }
  }

  const inv = { ...state.inventory };
  for (const [item, qty] of Object.entries(PET_FEED_COST)) {
    inv[item] = (inv[item] ?? 0) - qty;
    if (inv[item]! <= 0) delete inv[item];
  }

  return {
    ...state,
    inventory: inv,
    petStates: {
      ...state.petStates,
      [petId]: { ...ps, xp: ps.xp + PET_FEED_XP },
    },
    lastMeaningfulActivity: now,
  };
}
