import type { GameState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";
import { toolForNode } from "../../data/tools.data";
import { isReady } from "../../domain/time/time";
import { getActiveBoosts } from "../../domain/skills/skillEngine";
import { skillEffectsToBoosts, aggregateBoosts, applyBoost } from "../../domain/boosts/engine";

/** If no hit for 5 seconds, reset progress. */
const HIT_IDLE_RESET_MS = 5_000;

/**
 * Hit a resource node.
 * - Multiple hits required to gather (hitsToGather).
 * - If 5 seconds pass without a hit, progress resets to 0.
 * - Tool is NOT consumed until the final hit.
 * - On final hit: resource drops, tool consumed, node goes on cooldown.
 */
export function gatherNode(
  state: GameState,
  cx: number,
  cy: number,
  now: number,
): GameState {
  const key = cellKey(cx, cy);
  const cell = state.cells[key];
  if (!cell) return state;

  const nodeDef = RESOURCE_NODES[cell.type];
  if (!nodeDef) return state;

  // Check cooldown
  if (!isReady(cell.lastHarvest ?? 0, nodeDef.cooldownMs, now)) return state;

  // Check if exhausted (finite nodes)
  if (nodeDef.maxNodes >= 0 && (cell.hitsLeft ?? 0) <= 0) return state;

  // Must have tool to swing
  const toolId = toolForNode(cell.type);
  if (toolId) {
    const toolCount = state.inventory[toolId] ?? 0;
    if (toolCount < 1) return state;
  }

  // Reset hits if idle for 5 seconds
  const prevHits = cell.currentHits ?? 0;
  const lastHitAt = cell.lastHitAt ?? 0;
  const idleExpired = lastHitAt > 0 && (now - lastHitAt) > HIT_IDLE_RESET_MS;
  const baseHits = idleExpired ? 0 : prevHits;

  const currentHits = baseHits + 1;
  const isLastHit = currentHits >= nodeDef.hitsToGather;

  if (!isLastHit) {
    // Intermediate hit — no resource drop, no tool consumed
    const cells = { ...state.cells };
    cells[key] = { ...cell, currentHits, lastHitAt: now };
    return {
      ...state,
      cells,
      lastMeaningfulActivity: now,
    };
  }

  // --- Final hit: gather resource, consume tool, apply cooldown ---
  const inv = { ...state.inventory };

  // Consume 1 tool
  if (toolId) {
    inv[toolId] = (inv[toolId] ?? 0) - 1;
    if (inv[toolId]! <= 0) delete inv[toolId];
  }

  // Drop resource (apply skill boosts)
  const skillEffects = getActiveBoosts(state.skills);
  const boosts = aggregateBoosts(skillEffectsToBoosts(skillEffects));
  const boostedDrop = Math.floor(applyBoost(nodeDef.dropAmount, nodeDef.resource, boosts));
  inv[nodeDef.resource] = (inv[nodeDef.resource] ?? 0) + boostedDrop;

  // Update cell: reset hits, apply cooldown, decrement node count
  const cells = { ...state.cells };
  const newCell = { ...cell, currentHits: 0, lastHitAt: 0, lastHarvest: now };
  if (nodeDef.maxNodes >= 0) {
    newCell.hitsLeft = (cell.hitsLeft ?? nodeDef.maxNodes) - 1;
  }
  cells[key] = newCell;

  return {
    ...state,
    cells,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
