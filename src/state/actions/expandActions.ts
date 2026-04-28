import type { GameState, Cell, PendingExpansion } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { getExpansionList, ISLAND_TRANSITIONS } from "../../data/expansions.data";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";
import { BLOCK_SIZE, getNextExpansionPos } from "../../domain/expansion/blocks";
import { getLevel } from "../../domain/level/level";
import { isReady } from "../../domain/time/time";

/** Start an expansion (pay resources, begin build timer). */
export function startExpansion(state: GameState, now: number): GameState {
  if (state.pendingExpansion) return state;

  const expansions = getExpansionList(state.island);
  const nextIdx = state.expansion;
  if (nextIdx >= expansions.length) return state;

  const exp = expansions[nextIdx];
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

  const expansions = getExpansionList(state.island);
  const exp = expansions[pending.expansionIndex];
  const bp = pending.blockPos;

  const blocks = [...state.blocks, bp];
  const cells = { ...state.cells };
  const startCx = bp.bx * BLOCK_SIZE;
  const startCy = bp.by * BLOCK_SIZE;

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

  function place1x1(cell: Cell): boolean {
    for (let ly = 0; ly < BLOCK_SIZE; ly++) {
      for (let lx = 0; lx < BLOCK_SIZE; lx++) {
        const key = cellKey(startCx + lx, startCy + ly);
        if (!cells[key]) { cells[key] = cell; return true; }
      }
    }
    return false;
  }

  // Level gates: don't spawn cells player can't yet use (per SFL: fruit Lv12, flower Lv13)
  const playerLevel = getLevel(state.xp);
  const fruitGate = playerLevel >= 12;
  const flowerGate = playerLevel >= 13;

  // 2x2 objects FIRST (need contiguous space) — trees, fruit_patches, greenhouse
  for (let i = 0; i < exp.adds.trees; i++) {
    place2x2({ type: "tree", hitsLeft: -1, lastHarvest: 0 });
  }
  if (fruitGate) {
    for (let i = 0; i < (exp.adds.fruit_patches ?? 0); i++) place2x2({ type: "fruit_patch" });
  }
  for (let i = 0; i < (exp.adds.greenhouse ?? 0); i++) place2x2({ type: "greenhouse" });

  // 1x1 objects after (fill remaining cells)
  for (let i = 0; i < exp.adds.plots; i++) place1x1({ type: "plot" });
  for (let i = 0; i < (exp.adds.rocks ?? 0); i++) place1x1({ type: "rock", hitsLeft: RESOURCE_NODES.rock.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.iron ?? 0); i++) place1x1({ type: "iron", hitsLeft: RESOURCE_NODES.iron.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.gold ?? 0); i++) place1x1({ type: "gold", hitsLeft: RESOURCE_NODES.gold.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.crimstone ?? 0); i++) place1x1({ type: "crimstone", hitsLeft: RESOURCE_NODES.crimstone.maxNodes, lastHarvest: 0 });
  if (flowerGate) {
    for (let i = 0; i < (exp.adds.flower_beds ?? 0); i++) place1x1({ type: "flower_bed" });
  }
  for (let i = 0; i < (exp.adds.oil_reserve ?? 0); i++) place1x1({ type: "oil_reserve", hitsLeft: RESOURCE_NODES.oil_reserve.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.obsidian_rock ?? 0); i++) place1x1({ type: "obsidian_rock", hitsLeft: RESOURCE_NODES.obsidian_rock.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.sunstone_rock ?? 0); i++) place1x1({ type: "sunstone_rock", hitsLeft: RESOURCE_NODES.sunstone_rock.maxNodes, lastHarvest: 0 });
  for (let i = 0; i < (exp.adds.lava_pit ?? 0); i++) place1x1({ type: "lava_pit", hitsLeft: -1, lastHarvest: 0 });

  // Refresh ALL existing resource nodes — reset cooldowns + restore exhausted finite nodes.
  // Expansion reward: every tree/rock/ore on already-unlocked blocks becomes ready to gather again.
  const nodeTypes = ["tree", "rock", "iron", "gold", "crimstone", "oil_reserve", "obsidian_rock", "sunstone_rock", "lava_pit"];
  for (const [key, cell] of Object.entries(cells)) {
    if (nodeTypes.includes(cell.type) && !cell.parentKey) {
      const nodeDef = RESOURCE_NODES[cell.type];
      if (!nodeDef) continue;
      const refreshed: typeof cell = {
        ...cell,
        lastHarvest: 0,        // reset cooldown
        currentHits: 0,        // reset progress
        lastHitAt: 0,
      };
      // Refill exhausted finite nodes
      if (nodeDef.maxNodes >= 0 && (cell.hitsLeft ?? 0) <= 0) {
        refreshed.hitsLeft = nodeDef.maxNodes;
      }
      cells[key] = refreshed;
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

/** Travel from Basic → Spring Island (Lv11+, costs 10 gold). */
export function travelToSpring(state: GameState, now: number): GameState {
  if (state.island !== "basic") return state;

  const req = ISLAND_TRANSITIONS.spring;
  if (getLevel(state.xp) < req.minLevel) return state;

  const goldHave = state.inventory.gold ?? 0;
  if (goldHave < req.gold) return state;

  const inv = { ...state.inventory };
  inv.gold = goldHave - req.gold;
  if (inv.gold <= 0) delete inv.gold;

  return {
    ...state,
    island: "spring",
    expansion: 0,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}

/** Travel from Desert → Volcano Island (Lv40+, costs 50 oil). */
export function travelToVolcano(state: GameState, now: number): GameState {
  if (state.island !== "desert") return state;

  const req = ISLAND_TRANSITIONS.volcano;
  if (getLevel(state.xp) < req.minLevel) return state;

  const oilHave = state.inventory.oil ?? 0;
  if (oilHave < req.oil) return state;

  const inv = { ...state.inventory };
  inv.oil = oilHave - req.oil;
  if (inv.oil <= 0) delete inv.oil;

  return {
    ...state,
    island: "volcano",
    expansion: 0,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}

/** Travel from Spring → Desert Island (Lv30+, costs 20 crimstone). */
export function travelToDesert(state: GameState, now: number): GameState {
  if (state.island !== "spring") return state;

  const req = ISLAND_TRANSITIONS.desert;
  if (getLevel(state.xp) < req.minLevel) return state;

  const csHave = state.inventory.crimstone ?? 0;
  if (csHave < req.crimstone) return state;

  const inv = { ...state.inventory };
  inv.crimstone = csHave - req.crimstone;
  if (inv.crimstone <= 0) delete inv.crimstone;

  return {
    ...state,
    island: "desert",
    expansion: 0,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
