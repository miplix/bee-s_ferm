import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { GreenhouseCropId } from "../../domain/types/ids";
import { getGreenhouseCropDef } from "../../data/greenhouse.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";

/** Plant a greenhouse crop. Requires greenhouse building, seed, and oil. */
export function plantGreenhouse(
  state: GameState,
  cx: number,
  cy: number,
  cropId: GreenhouseCropId,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "greenhouse") return state;
  if (cell.greenhouseCropId) return state;

  // Must have greenhouse building
  if (!state.buildings.includes("greenhouse" as any)) return state;

  const seedId = `${cropId}_seed`;
  const seedCount = state.inventory[seedId] ?? 0;
  if (seedCount < 1) return state;

  const crop = getGreenhouseCropDef(cropId);
  if (getLevel(state.xp) < crop.level) return state;

  // Check oil
  const oilCount = state.inventory["oil"] ?? 0;
  if (oilCount < crop.oilCost) return state;

  const cells = { ...state.cells };
  cells[key] = {
    ...cell,
    greenhouseCropId: cropId,
    greenhousePlantedAt: now,
  };

  const inv = { ...state.inventory };
  inv[seedId] = seedCount - 1;
  if (inv[seedId]! <= 0) delete inv[seedId];
  inv["oil"] = oilCount - crop.oilCost;
  if (inv["oil"]! <= 0) delete inv["oil"];

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}

/** Harvest a ready greenhouse crop. */
export function harvestGreenhouse(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "greenhouse" || !cell.greenhouseCropId || !cell.greenhousePlantedAt) return state;

  const crop = getGreenhouseCropDef(cell.greenhouseCropId);
  if (elapsed(cell.greenhousePlantedAt, now) < crop.growMs) return state;

  const cells = { ...state.cells };
  cells[key] = {
    ...cell,
    greenhouseCropId: null,
    greenhousePlantedAt: null,
  };

  const inv = { ...state.inventory };
  inv[cell.greenhouseCropId] = (inv[cell.greenhouseCropId] ?? 0) + 1;

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
