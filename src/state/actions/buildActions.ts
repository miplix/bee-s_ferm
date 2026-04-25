import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import type { BuildingId } from "../../domain/types/ids";
import { getBuildingDef, getUpgradeDef } from "../../data/buildings.data";
import { getLevel } from "../../domain/level/level";
import { BLOCK_SIZE } from "../../domain/expansion/blocks";

/** Build a new building (one instance per id at MVP). */
export function build(
  state: GameState,
  buildingId: BuildingId,
  now: number,
): GameState {
  if (state.buildings.includes(buildingId)) return state;

  const def = getBuildingDef(buildingId);
  if (getLevel(state.xp) < def.level) return state;

  const inv = { ...state.inventory };
  let coins = state.coins;

  for (const [res, needed] of Object.entries(def.cost)) {
    if (res === "coins") {
      if (coins < needed - 0.001) return state;
    } else {
      if ((inv[res] ?? 0) < needed) return state;
    }
  }

  for (const [res, needed] of Object.entries(def.cost)) {
    if (res === "coins") {
      coins = parseFloat((coins - needed).toFixed(4));
    } else {
      inv[res] = (inv[res] ?? 0) - needed;
      if (inv[res]! <= 0) delete inv[res];
    }
  }

  // Place building on first empty cell within unlocked blocks
  const cells = { ...state.cells };
  let placed = false;

  for (const block of state.blocks) {
    if (placed) break;
    for (let ly = 0; ly < BLOCK_SIZE && !placed; ly++) {
      for (let lx = 0; lx < BLOCK_SIZE && !placed; lx++) {
        const cx = block.bx * BLOCK_SIZE + lx;
        const cy = block.by * BLOCK_SIZE + ly;
        const key = cellKey(cx, cy);
        if (!cells[key]) {
          cells[key] = { type: "building", buildingId };
          placed = true;
        }
      }
    }
  }

  // No empty cell — do not consume resources nor mark as built
  if (!placed) return state;

  return {
    ...state,
    buildings: [...state.buildings, buildingId],
    cells,
    inventory: inv,
    coins,
    lastMeaningfulActivity: now,
  };
}

/** Upgrade a building to the next level. */
export function upgradeBuilding(
  state: GameState,
  buildingId: BuildingId,
  now: number,
): GameState {
  if (!state.buildings.includes(buildingId)) return state;

  const currentLevel = state.buildingLevels?.[buildingId] ?? 1;
  const upgrade = getUpgradeDef(buildingId, currentLevel);
  if (!upgrade) return state; // already max level

  const inv = { ...state.inventory };
  let coins = state.coins;

  // Check resources
  for (const [res, needed] of Object.entries(upgrade.cost)) {
    if (res === "coins") {
      if (coins < needed - 0.001) return state;
    } else {
      if ((inv[res] ?? 0) < needed) return state;
    }
  }

  // Deduct resources
  for (const [res, needed] of Object.entries(upgrade.cost)) {
    if (res === "coins") {
      coins = parseFloat((coins - needed).toFixed(4));
    } else {
      inv[res] = (inv[res] ?? 0) - needed;
      if (inv[res]! <= 0) delete inv[res];
    }
  }

  return {
    ...state,
    buildingLevels: { ...state.buildingLevels, [buildingId]: upgrade.toLevel },
    inventory: inv,
    coins,
    lastMeaningfulActivity: now,
  };
}
