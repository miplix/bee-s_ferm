/**
 * Block-based island expansion system.
 *
 * Each block is 3x3 cells. The island starts with 4 blocks (2x2 arrangement).
 * Expansion adds one 3x3 block at a time, spiraling clockwise.
 *
 * Block coordinate system (bx, by):
 *   Starting blocks: (0,0), (1,0), (0,1), (1,1)
 *   First expansion: (2,0) — right of top-right block
 *   Then clockwise spiral outward.
 *
 * To avoid negative coordinates, we use an offset system:
 *   All block coords are stored as-is (can be negative).
 *   The renderer computes minX/minY and offsets everything.
 */

export const BLOCK_SIZE = 3; // 3x3 cells per block

export interface BlockPos {
  bx: number;
  by: number;
}

/** Starting blocks (always present). 2x2 blocks = 4 blocks = 6x6 cells = 36 cells.
 *  Fits: 3 trees (2x2=12) + 3 buildings (2x2=12) + 5 plots (1x1=5) = 29/36. */
export const STARTING_BLOCKS: readonly BlockPos[] = [
  { bx: 0, by: 0 },
  { bx: 1, by: 0 },
  { bx: 0, by: 1 },
  { bx: 1, by: 1 },
];

/**
 * Spiral expansion order — clockwise starting from top-right.
 * Each entry is the block position for that expansion number.
 * Expansion 0 = first unlock (5th block total).
 */
export const EXPANSION_SPIRAL: readonly BlockPos[] = [
  // Starting area is 2x2 blocks (bx 0-1, by 0-1).
  // Spiral clockwise from top-right.
  // Ring 1
  { bx: 2, by: 0 },   // exp 0: right of top-right
  { bx: 2, by: 1 },   // exp 1: below that
  { bx: 2, by: 2 },   // exp 2: bottom-right
  { bx: 1, by: 2 },   // exp 3: bottom middle
  { bx: 0, by: 2 },   // exp 4: bottom-left
  { bx: -1, by: 2 },  // exp 5: far bottom-left
  { bx: -1, by: 1 },  // exp 6: left middle
  { bx: -1, by: 0 },  // exp 7: left top
  { bx: -1, by: -1 }, // exp 8: top-left corner

  // Ring 2
  { bx: 0, by: -1 },  // exp 9
  { bx: 1, by: -1 },  // exp 10
  { bx: 2, by: -1 },  // exp 11
  { bx: 3, by: -1 },  // exp 12
  { bx: 3, by: 0 },   // exp 13
  { bx: 3, by: 1 },   // exp 14
  { bx: 3, by: 2 },   // exp 15
  { bx: 3, by: 3 },   // exp 16
  { bx: 2, by: 3 },   // exp 17
  { bx: 1, by: 3 },   // exp 18
  { bx: 0, by: 3 },   // exp 19
];

/** Get the position of the NEXT expansion block (where the expand button goes). */
export function getNextExpansionPos(expansionIndex: number): BlockPos | null {
  if (expansionIndex >= EXPANSION_SPIRAL.length) return null;
  return EXPANSION_SPIRAL[expansionIndex];
}

/** Compute the bounding box of all unlocked blocks in cell coordinates. */
export function computeGridBounds(blocks: readonly BlockPos[]): {
  minCellX: number;
  minCellY: number;
  maxCellX: number;
  maxCellY: number;
  gridW: number;
  gridH: number;
} {
  let minBx = Infinity, maxBx = -Infinity;
  let minBy = Infinity, maxBy = -Infinity;

  for (const b of blocks) {
    if (b.bx < minBx) minBx = b.bx;
    if (b.bx > maxBx) maxBx = b.bx;
    if (b.by < minBy) minBy = b.by;
    if (b.by > maxBy) maxBy = b.by;
  }

  // Include the next expansion position in bounds for the expand button
  const minCellX = minBx * BLOCK_SIZE;
  const minCellY = minBy * BLOCK_SIZE;
  const maxCellX = (maxBx + 1) * BLOCK_SIZE - 1;
  const maxCellY = (maxBy + 1) * BLOCK_SIZE - 1;

  return {
    minCellX,
    minCellY,
    maxCellX,
    maxCellY,
    gridW: maxCellX - minCellX + 1,
    gridH: maxCellY - minCellY + 1,
  };
}

/** Check if a cell coordinate belongs to any unlocked block. */
export function isCellInBlocks(
  cellX: number,
  cellY: number,
  blocks: readonly BlockPos[],
): boolean {
  const bx = Math.floor(cellX / BLOCK_SIZE);
  const by = Math.floor(cellY / BLOCK_SIZE);
  return blocks.some((b) => b.bx === bx && b.by === by);
}

/** Convert block-local cell position to block coordinates. */
export function cellToBlock(cellX: number, cellY: number): BlockPos {
  return {
    bx: Math.floor(cellX / BLOCK_SIZE),
    by: Math.floor(cellY / BLOCK_SIZE),
  };
}
