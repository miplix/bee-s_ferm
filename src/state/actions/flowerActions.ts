import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { FlowerId } from "../../domain/types/ids";
import { getFlowerDef } from "../../data/flowers.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";

/** Plant a flower on a flower_bed cell. Consumes 1 flower seed. */
export function plantFlower(
  state: GameState,
  cx: number,
  cy: number,
  flowerId: FlowerId,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "flower_bed") return state;
  if (cell.flowerId) return state;

  const seedId = `${flowerId}_seed`;
  const seedCount = state.inventory[seedId] ?? 0;
  if (seedCount < 1) return state;

  const flower = getFlowerDef(flowerId);
  if (getLevel(state.xp) < flower.level) return state;

  const cells = { ...state.cells };
  cells[key] = {
    ...cell,
    flowerId,
    flowerPlantedAt: now,
  };

  return {
    ...state,
    cells,
    inventory: { ...state.inventory, [seedId]: seedCount - 1 },
    lastMeaningfulActivity: now,
  };
}

/** Harvest a grown flower. Adds flower item to inventory. */
export function harvestFlower(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "flower_bed" || !cell.flowerId || !cell.flowerPlantedAt) return state;

  const flower = getFlowerDef(cell.flowerId);
  if (elapsed(cell.flowerPlantedAt, now) < flower.growMs) return state;

  const cells = { ...state.cells };
  cells[key] = {
    ...cell,
    flowerId: null,
    flowerPlantedAt: null,
  };

  const inv = { ...state.inventory };
  inv[cell.flowerId] = (inv[cell.flowerId] ?? 0) + 1;

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
