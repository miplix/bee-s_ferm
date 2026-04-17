import type { GameState } from "../../domain/types/game";
import { getFactionDef } from "../../data/factions.data";

/** Join a faction. One-time irreversible choice. */
export function joinFaction(
  state: GameState,
  factionId: string,
): GameState {
  // Already joined a faction — irreversible
  if (state.faction !== null) return state;

  // Validate faction exists
  if (!getFactionDef(factionId)) return state;

  return { ...state, faction: factionId };
}
