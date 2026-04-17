import type { Cell } from "../types/game";
import { cellKey } from "../types/game";

/**
 * Place a multi-cell object (w x h) at position (cx, cy).
 * The top-left cell gets the full Cell data with w/h.
 * Other cells get a reference back to the parent via parentKey.
 */
export function placeMultiCell(
  cells: Record<string, Cell>,
  cx: number,
  cy: number,
  cell: Cell,
  w: number,
  h: number,
): void {
  const pKey = cellKey(cx, cy);
  cells[pKey] = { ...cell, w, h };

  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      if (dx === 0 && dy === 0) continue; // parent already placed
      const key = cellKey(cx + dx, cy + dy);
      cells[key] = { type: cell.type, parentKey: pKey, buildingId: cell.buildingId };
    }
  }
}

/** Check if a wxh area starting at (cx,cy) is clear within unlocked blocks. */
export function canPlaceMultiCell(
  cells: Record<string, Cell>,
  cx: number,
  cy: number,
  w: number,
  h: number,
  blocks: { bx: number; by: number }[],
  blockSize: number,
): boolean {
  const blockSet = new Set(blocks.map((b) => `${b.bx},${b.by}`));

  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      // Must be in an unlocked block
      const bx = Math.floor(x / blockSize);
      const by = Math.floor(y / blockSize);
      if (!blockSet.has(`${bx},${by}`)) return false;
      // Must be empty
      if (cells[cellKey(x, y)]) return false;
    }
  }
  return true;
}

/** Resolve a cell click to the parent cell (for multi-cell objects). */
export function resolveParent(
  cells: Record<string, Cell>,
  key: string,
): { cell: Cell; key: string } | null {
  const cell = cells[key];
  if (!cell) return null;
  if (cell.parentKey) {
    const parent = cells[cell.parentKey];
    if (parent) return { cell: parent, key: cell.parentKey };
  }
  return { cell, key };
}
