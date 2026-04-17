/**
 * Actions for placing and removing collectibles on the farm.
 */

import type { GameState } from "../../domain/types/game";
import { getCollectibleDef } from "../../data/collectibles.data";

/**
 * Place a collectible on the farm. Consumes from inventory.
 */
export function placeCollectible(
  state: GameState,
  collectibleId: string,
): GameState {
  const def = getCollectibleDef(collectibleId);
  if (!def) return state;

  // Must have the item in inventory
  const count = state.inventory[collectibleId] ?? 0;
  if (count < 1) return state;

  // Cannot place duplicates
  if (state.collectibles.includes(collectibleId)) return state;

  const inv = { ...state.inventory };
  inv[collectibleId] = count - 1;
  if (inv[collectibleId] <= 0) delete inv[collectibleId];

  return {
    ...state,
    inventory: inv,
    collectibles: [...state.collectibles, collectibleId],
  };
}

/**
 * Remove a placed collectible (returns it to inventory).
 */
export function removeCollectible(
  state: GameState,
  collectibleId: string,
): GameState {
  if (!state.collectibles.includes(collectibleId)) return state;

  const inv = { ...state.inventory };
  inv[collectibleId] = (inv[collectibleId] ?? 0) + 1;

  return {
    ...state,
    inventory: inv,
    collectibles: state.collectibles.filter((id) => id !== collectibleId),
  };
}
