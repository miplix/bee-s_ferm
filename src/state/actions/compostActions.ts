import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { getComposterDef, getFertilizerDef } from "../../data/composters.data";
import { getLevel } from "../../domain/level/level";
import { elapsed } from "../../domain/time/time";

/**
 * Start composting: consume ingredients, create a compost slot with timer.
 */
export function startCompost(
  state: GameState,
  composterId: string,
  now: number,
): GameState {
  const def = getComposterDef(composterId);
  if (!def) return state;

  // Level check
  if (getLevel(state.xp) < def.level) return state;

  // Check ingredients
  const inv = { ...state.inventory };
  for (const [itemId, qty] of Object.entries(def.input)) {
    if ((inv[itemId] ?? 0) < qty) return state;
  }

  // Consume ingredients
  for (const [itemId, qty] of Object.entries(def.input)) {
    inv[itemId] = (inv[itemId] ?? 0) - qty;
    if (inv[itemId]! <= 0) delete inv[itemId];
  }

  const slot = {
    id: composterId,
    startedAt: now,
    durationMs: def.processTimeMs,
  };

  return {
    ...state,
    inventory: inv,
    compostSlots: [...state.compostSlots, slot],
    lastMeaningfulActivity: now,
  };
}

/**
 * Collect finished compost: check timer, add fertilizer + worm to inventory.
 */
export function collectCompost(
  state: GameState,
  slotIndex: number,
  now: number,
): GameState {
  const slot = state.compostSlots[slotIndex];
  if (!slot) return state;

  // Check if composting is done
  if (elapsed(slot.startedAt, now) < slot.durationMs) return state;

  const def = getComposterDef(slot.id);
  if (!def) return state;

  const inv = { ...state.inventory };

  // Add fertilizer
  inv[def.output.fertilizer] = (inv[def.output.fertilizer] ?? 0) + def.output.qty;

  // Add worm (if any)
  if (def.output.worm) {
    inv[def.output.worm] = (inv[def.output.worm] ?? 0) + 1;
  }

  // Remove the completed slot
  const compostSlots = state.compostSlots.filter((_, i) => i !== slotIndex);

  return {
    ...state,
    inventory: inv,
    compostSlots,
    lastMeaningfulActivity: now,
  };
}

/**
 * Apply fertilizer to a specific plot cell.
 * - sprout_mix: +0.2 flat crop yield (stored on cell, applied at harvest)
 * - fruitful_blend: +0.2 flat fruit yield (stored on cell, applied at harvest)
 * - rapid_root: -50% remaining grow time (modifies effectiveGrowMs immediately)
 */
export function applyFertilizer(
  state: GameState,
  cx: number,
  cy: number,
  fertilizerId: string,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell || cell.type !== "plot") return state;

  // Must have fertilizer in inventory
  const fertCount = state.inventory[fertilizerId] ?? 0;
  if (fertCount < 1) return state;

  const fertDef = getFertilizerDef(fertilizerId);
  if (!fertDef) return state;

  // Cannot stack fertilizers on the same plot
  if (cell.fertilizerId) return state;

  const inv = { ...state.inventory };
  inv[fertilizerId] = fertCount - 1;
  if (inv[fertilizerId]! <= 0) delete inv[fertilizerId];

  const cells = { ...state.cells };

  if (fertDef.effect.type === "speed_up" && cell.cropId && cell.plantedAt != null) {
    // rapid_root: reduce remaining grow time by 50%
    const currentGrowMs = cell.effectiveGrowMs ?? 0;
    if (currentGrowMs > 0) {
      const elapsedMs = now - cell.plantedAt;
      const remainingMs = Math.max(0, currentGrowMs - elapsedMs);
      const newRemaining = Math.round(remainingMs * (1 - fertDef.effect.value));
      const newEffectiveGrowMs = elapsedMs + newRemaining;
      cells[key] = { ...cell, effectiveGrowMs: newEffectiveGrowMs, fertilizerId };
    } else {
      cells[key] = { ...cell, fertilizerId };
    }
  } else {
    // sprout_mix / fruitful_blend: store on cell, applied at harvest time
    cells[key] = { ...cell, fertilizerId };
  }

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
