import type { GameState } from "../../domain/types/game";
import { getPetDef } from "../../data/pets.data";

/** Adopt a pet. Adds it to the player's pet collection if not already owned. */
export function adoptPet(
  state: GameState,
  petId: string,
): GameState {
  // Validate pet exists
  if (!getPetDef(petId)) return state;

  // Already owned
  if (state.pets.includes(petId)) return state;

  return { ...state, pets: [...state.pets, petId] };
}
