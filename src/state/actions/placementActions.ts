import type { GameState, Cell } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";

const BIG_TYPES = new Set(["tree", "fruit_patch", "greenhouse"]);

function makeCell(type: string): Cell {
  if (type === "tree") return { type: "tree", hitsLeft: -1, lastHarvest: 0 } as any;
  if (type === "fruit_patch") return { type: "fruit_patch" } as any;
  if (type === "greenhouse") return { type: "greenhouse" } as any;
  if (type === "plot") return { type: "plot" } as any;
  if (type === "flower_bed") return { type: "flower_bed" } as any;
  if (type === "lava_pit") return { type: "lava_pit", hitsLeft: -1, lastHarvest: 0 } as any;
  // resource nodes with maxNodes
  const def = RESOURCE_NODES[type];
  if (def) return { type, hitsLeft: def.maxNodes, lastHarvest: 0 } as any;
  return { type } as any;
}

/**
 * Place a pending item from `pendingPlacements` onto cell (cx, cy).
 * Validates: pending count > 0, cell empty, fits 1x1 or 2x2 (top-left at cx,cy).
 */
export function placePending(state: GameState, type: string, cx: number, cy: number): GameState {
  const pending = state.pendingPlacements ?? {};
  const count = pending[type] ?? 0;
  if (count <= 0) return state;

  const big = BIG_TYPES.has(type);
  const cells = { ...state.cells };

  if (big) {
    const k00 = cellKey(cx, cy);
    const k10 = cellKey(cx + 1, cy);
    const k01 = cellKey(cx, cy + 1);
    const k11 = cellKey(cx + 1, cy + 1);
    if (cells[k00] || cells[k10] || cells[k01] || cells[k11]) return state;
    const baseCell = makeCell(type);
    cells[k00] = { ...baseCell, w: 2, h: 2 } as any;
    cells[k10] = { type: baseCell.type, parentKey: k00 } as any;
    cells[k01] = { type: baseCell.type, parentKey: k00 } as any;
    cells[k11] = { type: baseCell.type, parentKey: k00 } as any;
  } else {
    const k = cellKey(cx, cy);
    if (cells[k]) return state;
    cells[k] = makeCell(type);
  }

  const newPending = { ...pending, [type]: count - 1 };
  if (newPending[type]! <= 0) delete newPending[type];

  return {
    ...state,
    cells,
    pendingPlacements: newPending,
    lastMeaningfulActivity: Date.now(),
  };
}
