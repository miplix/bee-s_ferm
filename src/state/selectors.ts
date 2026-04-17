import type { Store } from "./store";
import { getLevel, xpProgress, xpForNext } from "../domain/level/level";
import { maxBeehiveSlots } from "../domain/beehives/slots";

// Character
export const selectLevel = (s: Store) => getLevel(s.xp);
export const selectXpProgress = (s: Store) => xpProgress(s.xp);
export const selectXpForNext = (s: Store) => xpForNext(getLevel(s.xp));

// Beehives
export const selectMaxHiveSlots = (s: Store) =>
  maxBeehiveSlots(getLevel(s.xp), s.island);

// Inventory helper
export const selectItemCount = (id: string) => (s: Store) =>
  s.inventory[id] ?? 0;

// Buildings
export const selectHasBuilding = (id: string) => (s: Store) =>
  s.buildings.includes(id as any);
