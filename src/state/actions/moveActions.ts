import type { GameState, Cell } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";
import { getCropDef } from "../../data/crops.data";
import { isReady } from "../../domain/time/time";
import type { CropId } from "../../domain/types/ids";
import { BLOCK_SIZE } from "../../domain/expansion/blocks";

/**
 * Check if a cell is currently on cooldown and therefore immovable.
 * - Plot with growing crop → blocked
 * - Resource node on cooldown → blocked
 * - Resource node mid-hit (currentHits > 0) → blocked
 */
export function isCellMovable(cell: Cell, now: number): boolean {
  // Plot with active crop
  if (cell.type === "plot" && cell.cropId && cell.plantedAt) {
    const crop = getCropDef(cell.cropId as CropId);
    const elapsed = now - cell.plantedAt;
    if (elapsed < crop.growMs) return false; // still growing
  }

  // Resource node on cooldown
  if (["tree", "rock", "iron", "gold"].includes(cell.type)) {
    const nodeDef = RESOURCE_NODES[cell.type];
    if (nodeDef) {
      if (!isReady(cell.lastHarvest ?? 0, nodeDef.cooldownMs, now)) return false;
      if ((cell.currentHits ?? 0) > 0) return false; // mid-hit
    }
  }

  return true;
}

/** Start moving: select source cell. */
export function selectMoveSource(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell) return { ...state, moveSource: null };

  if (!isCellMovable(cell, now)) return state; // can't move — on cooldown

  return { ...state, moveSource: key };
}

/** Complete move: place source cell at target empty cell. */
export function completeMove(
  state: GameState,
  targetCx: number,
  targetCy: number,
): GameState {
  if (!state.moveSource) return state;

  const targetKey = cellKey(targetCx, targetCy);

  // Target must be empty and within unlocked blocks
  if (state.cells[targetKey]) return state; // occupied

  // Check target is within a block
  const bx = Math.floor(targetCx / BLOCK_SIZE);
  const by = Math.floor(targetCy / BLOCK_SIZE);
  const inBlock = state.blocks.some((b) => b.bx === bx && b.by === by);
  if (!inBlock) return state;

  // Move the cell
  const cells = { ...state.cells };
  const sourceCell = cells[state.moveSource];
  if (!sourceCell) return { ...state, moveSource: null, moveMode: false };

  delete cells[state.moveSource];
  cells[targetKey] = sourceCell;

  return {
    ...state,
    cells,
    moveSource: null,
    moveMode: false,
  };
}

/** Cancel move mode. */
export function cancelMove(state: GameState): GameState {
  return { ...state, moveMode: false, moveSource: null };
}
