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
 * Apply fertilizer to a plot or fruit_patch cell.
 * - sprout_mix: ×1.5 crop yield for 12h (prorated at harvest by time-under-boost)
 * - fruitful_blend: ×2 fruit yield for 12h (prorated at harvest by time-under-boost)
 * - rapid_root: -50% remaining grow time (one-shot, no timer)
 *
 * Fertilizer can be applied to:
 *   - empty cell (will boost the next planting once a crop is planted)
 *   - cell with a growing crop (boost begins immediately, prorated)
 * Cannot stack: cell must have no active fertilizer.
 */
export function applyFertilizer(
  state: GameState,
  cx: number,
  cy: number,
  fertilizerId: string,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  // resolve to parent for 2x2 (fruit_patch)
  const rawCell = state.cells[key];
  if (!rawCell) return state;
  const realKey = rawCell.parentKey ?? key;
  const cell = state.cells[realKey];
  if (!cell) return state;

  const fertDef = getFertilizerDef(fertilizerId);
  if (!fertDef) return state;

  // Type compatibility check
  if (fertDef.effect.type === "fruit_yield_mult") {
    if (cell.type !== "fruit_patch") return state;
  } else {
    // sprout_mix / rapid_root → only plot
    if (cell.type !== "plot") return state;
  }

  // Must have fertilizer in inventory
  const fertCount = state.inventory[fertilizerId] ?? 0;
  if (fertCount < 1) return state;

  // Cannot stack: only allow if no active fertilizer (or expired)
  const stillActive = (cell.fertilizerUntil ?? 0) > now;
  if (cell.fertilizerId && stillActive) return state;

  const inv = { ...state.inventory };
  inv[fertilizerId] = fertCount - 1;
  if (inv[fertilizerId]! <= 0) delete inv[fertilizerId];

  const cells = { ...state.cells };

  if (fertDef.effect.type === "speed_up") {
    // rapid_root: reduce remaining grow time by 50% (one-shot, no timer)
    if (cell.cropId && cell.plantedAt != null) {
      const baseGrowMs = cell.effectiveGrowMs ?? 0;
      if (baseGrowMs > 0) {
        const elapsedMs = now - cell.plantedAt;
        const remainingMs = Math.max(0, baseGrowMs - elapsedMs);
        const newRemaining = Math.round(remainingMs * (1 - fertDef.effect.value));
        const newEffectiveGrowMs = elapsedMs + newRemaining;
        cells[realKey] = {
          ...cell,
          effectiveGrowMs: newEffectiveGrowMs,
          fertilizerId,
          fertilizedAt: now,
          fertilizerUntil: null, // one-shot effect
        };
      } else {
        // No crop planted — speed-up has no effect, refund? For UX, refund:
        inv[fertilizerId] = (inv[fertilizerId] ?? 0) + 1;
        return state;
      }
    } else {
      // No crop — refund
      inv[fertilizerId] = (inv[fertilizerId] ?? 0) + 1;
      return state;
    }
  } else {
    // yield_mult / fruit_yield_mult: time-based, prorated at harvest
    const durationMs = fertDef.effect.durationMs ?? 0;
    cells[realKey] = {
      ...cell,
      fertilizerId,
      fertilizedAt: now,
      fertilizerUntil: now + durationMs,
    };
  }

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}

/**
 * Compute prorated yield multiplier for a fertilizer applied to a growing cell.
 * Same prorating model as pollen boost: yield_mult = 1 + boostFraction × (mult - 1).
 *
 * `mult` is the fertilizer's multiplier (e.g. 1.5 for sprout_mix, 2.0 for fruitful_blend).
 * Returns 1 if no fertilizer is active or it doesn't match the requested type.
 */
export function fertilizerProratedMultiplier(
  fertilizerId: string | null | undefined,
  expectedType: "yield_mult" | "fruit_yield_mult",
  cycleStart: number,             // plantedAt or refTime (for fruit re-harvests)
  growMs: number,
  fertilizedAt: number | null | undefined,
  fertilizerUntil: number | null | undefined,
  harvestTime: number,
): number {
  if (!fertilizerId || !fertilizedAt || !fertilizerUntil) return 1;
  const def = getFertilizerDef(fertilizerId);
  if (!def || def.effect.type !== expectedType) return 1;

  const totalGrow = Math.min(harvestTime, cycleStart + growMs) - cycleStart;
  if (totalGrow <= 0) return 1;
  const boostStart = Math.max(cycleStart, fertilizedAt);
  const boostEnd = Math.min(cycleStart + growMs, fertilizerUntil, harvestTime);
  const boostedTime = Math.max(0, boostEnd - boostStart);
  const fraction = boostedTime / totalGrow;
  return 1 + fraction * (def.effect.value - 1);
}
