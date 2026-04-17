import type { GameState, Cell, PendingExpansion } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { EXPANSIONS, ISLAND_TRANSITIONS } from "../../data/expansions.data";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";
import { BLOCK_SIZE, getNextExpansionPos } from "../../domain/expansion/blocks";
import { getLevel } from "../../domain/level/level";
import { isReady } from "../../domain/time/time";

/** Start an expansion (pay resources, begin build timer). */
export function startExpansion(state: GameState, now: number): GameState {
  if (state.pendingExpansion) return state; // already building

  const nextIdx = state.expansion;
  if (nextIdx >= EXPANSIONS.length) return state;

  const exp = EXPANSIONS[nextIdx];
  const level = getLevel(state.xp);
  if (level < exp.minLevel) return state;

  const nextBlockPos = getNextExpansionPos(nextIdx);
  if (!nextBlockPos) return state;

  // Check cost
  const inv = { ...state.inventory };
  let coins = state.coins;

  for (const [res, needed] of Object.entries(exp.cost)) {
    if (res === "coins") {
      if (coins < needed - 0.001) return state;
    } else {
      if ((inv[res] ?? 0) < needed) return state;
    }
  }

  // Deduct cost
  for (const [res, needed] of Object.entries(exp.cost)) {
    if (res === "coins") {
      coins = parseFloat((coins - needed).toFixed(4));
    } else {
      inv[res] = (inv[res] ?? 0) - needed;
      if (inv[res]! <= 0) delete inv[res];
    }
  }

  // Build time: 30s base + 30s per expansion index (scales with progression)
  const buildTimeMs = (30 + nextIdx * 30) * 1000;

  const pending: PendingExpansion = {
    expansionIndex: nextIdx,
    startedAt: now,
    durationMs: buildTimeMs,
    blockPos: nextBlockPos,
  };

  return {
    ...state,
    inventory: inv,
    coins,
    pendingExpansion: pending,
    lastMeaningfulActivity: now,
  };
}

/** Complete a pending expansion (called when timer finishes). */
export function completeExpansion(state: GameState, now: number): GameState {
  const pending = state.pendingExpansion;
  if (!pending) return state;
  if (!isReady(pending.startedAt, pending.durationMs, now)) return state;

  const exp = EXPANSIONS[pending.expansionIndex];
  const bp = pending.blockPos;

  // Add block
  const blocks = [...state.blocks, bp];

  // Place new resources on the new 3x3 block
  const cells = { ...state.cells };
  const startCx = bp.bx * BLOCK_SIZE;
  const startCy = bp.by * BLOCK_SIZE;

  // Helper: place 2x2 object at first available 2x2 area in block
  function place2x2(cell: Cell): boolean {
    for (let ly = 0; ly < BLOCK_SIZE - 1; ly++) {
      for (let lx = 0; lx < BLOCK_SIZE - 1; lx++) {
        const cx = startCx + lx;
        const cy = startCy + ly;
        const k00 = cellKey(cx, cy);
        const k10 = cellKey(cx + 1, cy);
        const k01 = cellKey(cx, cy + 1);
        const k11 = cellKey(cx + 1, cy + 1);
        if (!cells[k00] && !cells[k10] && !cells[k01] && !cells[k11]) {
          cells[k00] = { ...cell, w: 2, h: 2 };
          cells[k10] = { type: cell.type, parentKey: k00 };
          cells[k01] = { type: cell.type, parentKey: k00 };
          cells[k11] = { type: cell.type, parentKey: k00 };
          return true;
        }
      }
    }
    return false;
  }

  // Helper: place 1x1 at first empty cell
  function place1x1(cell: Cell): boolean {
    for (let ly = 0; ly < BLOCK_SIZE; ly++) {
      for (let lx = 0; lx < BLOCK_SIZE; lx++) {
        const key = cellKey(startCx + lx, startCy + ly);
        if (!cells[key]) { cells[key] = cell; return true; }
      }
    }
    return false;
  }

  // Place trees as 2x2 first (they take more space)
  for (let i = 0; i < exp.adds.trees; i++) {
    place2x2({ type: "tree", hitsLeft: -1, lastHarvest: 0 });
  }

  // Then 1x1 items
  for (let i = 0; i < exp.adds.plots; i++) place1x1({ type: "plot" });
  for (let i = 0; i < exp.adds.rocks; i++) place1x1({ type: "rock", hitsLeft: RESOURCE_NODES.rock.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < exp.adds.iron; i++) place1x1({ type: "iron", hitsLeft: RESOURCE_NODES.iron.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < exp.adds.gold; i++) place1x1({ type: "gold", hitsLeft: RESOURCE_NODES.gold.maxNodes, lastHarvest: 0 });

  // Also restore exhausted nodes on existing blocks
  for (const [key, cell] of Object.entries(cells)) {
    if (["rock", "iron", "gold"].includes(cell.type)) {
      const nodeDef = RESOURCE_NODES[cell.type];
      if (nodeDef && nodeDef.maxNodes >= 0 && (cell.hitsLeft ?? 0) <= 0) {
        cells[key] = { ...cell, hitsLeft: nodeDef.maxNodes, lastHarvest: 0 };
      }
    }
  }

  return {
    ...state,
    blocks,
    cells,
    expansion: pending.expansionIndex + 1,
    pendingExpansion: null,
    lastMeaningfulActivity: now,
  };
}

/** Travel from Basic to Spring Island (costs 10 gold). */
export function travelToSpring(state: GameState, now: number): GameState {
  if (state.island !== "basic") return state;

  const cost = ISLAND_TRANSITIONS.spring;
  const goldNeeded = cost.gold;
  const goldHave = state.inventory.gold ?? 0;
  if (goldHave < goldNeeded) return state;

  const inv = { ...state.inventory };
  inv.gold = goldHave - goldNeeded;
  if (inv.gold <= 0) delete inv.gold;

  return {
    ...state,
    island: "spring",
    expansion: 0,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
