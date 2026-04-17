import type { GameState, CropMachineState } from "../../domain/types/game";
import { getLevel } from "../../domain/level/level";
import { CROP_MACHINE, MACHINE_CROPS } from "../../data/cropMachine.data";
import { CROPS } from "../../data/crops.data";

// --- Helpers ---

function hasResources(inventory: Record<string, number>, cost: Record<string, number>): boolean {
  for (const [k, v] of Object.entries(cost)) {
    if (k === "coins") continue; // coins checked separately
    if ((inventory[k] ?? 0) < v) return false;
  }
  return true;
}

function deductResources(
  inventory: Record<string, number>,
  cost: Record<string, number>,
): Record<string, number> {
  const inv = { ...inventory };
  for (const [k, v] of Object.entries(cost)) {
    if (k === "coins") continue;
    inv[k] = (inv[k] ?? 0) - v;
    if (inv[k]! <= 0) delete inv[k];
  }
  return inv;
}

// --- Actions ---

/**
 * Build the Crop Machine. Requires level 35 + desert island + resources.
 */
export function buildCropMachine(state: GameState, now: number): GameState {
  if (state.cropMachine) return state; // already built

  const level = getLevel(state.xp);
  if (level < CROP_MACHINE.level) return state;
  if (state.island !== CROP_MACHINE.requiredIsland) return state;

  const coinCost = CROP_MACHINE.buildCost["coins"] ?? 0;
  if (state.coins < coinCost) return state;
  if (!hasResources(state.inventory, CROP_MACHINE.buildCost)) return state;

  const machine: CropMachineState = {
    built: true,
    queue: [],
    oilTank: 0,
    maxOilTank: CROP_MACHINE.tankCapacityHours,
  };

  return {
    ...state,
    coins: parseFloat((state.coins - coinCost).toFixed(4)),
    inventory: deductResources(state.inventory, CROP_MACHINE.buildCost),
    cropMachine: machine,
    lastMeaningfulActivity: now,
  };
}

/**
 * Add a crop batch to the machine queue. Consumes seeds from inventory.
 * Oil consumption: 1 per hour. Growth time = crop.growMs.
 */
export function addToQueue(
  state: GameState,
  cropId: string,
  qty: number,
  now: number,
): GameState {
  if (!state.cropMachine) return state;
  if (qty <= 0) return state;

  // Check crop is allowed in machine
  if (!MACHINE_CROPS.includes(cropId)) return state;

  // Check queue slots
  if (state.cropMachine.queue.length >= CROP_MACHINE.baseQueueSlots) return state;

  // Get crop definition for growMs
  const cropDef = CROPS.find((c) => c.id === cropId);
  if (!cropDef) return state;

  // Check seeds in inventory
  const seedId = `${cropId}_seed`;
  const seedCount = state.inventory[seedId] ?? 0;
  if (seedCount < qty) return state;

  // Check oil: need enough for grow duration
  const growHours = cropDef.growMs / (1000 * 60 * 60);
  if (state.cropMachine.oilTank < growHours) return state;

  // Consume seeds
  const inv = { ...state.inventory };
  inv[seedId] = seedCount - qty;
  if (inv[seedId]! <= 0) delete inv[seedId];

  // Deduct oil reservation
  const newOilTank = parseFloat((state.cropMachine.oilTank - growHours).toFixed(4));

  const queueItem = {
    cropId,
    qty,
    startedAt: now,
    durationMs: cropDef.growMs,
  };

  return {
    ...state,
    inventory: inv,
    cropMachine: {
      ...state.cropMachine,
      queue: [...state.cropMachine.queue, queueItem],
      oilTank: newOilTank,
    },
    lastMeaningfulActivity: now,
  };
}

/**
 * Collect finished crops from the queue at the given index.
 */
export function collectFromQueue(
  state: GameState,
  index: number,
  now: number,
): GameState {
  if (!state.cropMachine) return state;

  const item = state.cropMachine.queue[index];
  if (!item) return state;

  // Check if finished
  if (now < item.startedAt + item.durationMs) return state;

  const cropDef = CROPS.find((c) => c.id === item.cropId);
  if (!cropDef) return state;

  // Add harvested crops to inventory
  const inv = { ...state.inventory };
  const harvestTotal = item.qty * cropDef.harvestCount;
  inv[item.cropId] = (inv[item.cropId] ?? 0) + harvestTotal;

  // Remove from queue
  const newQueue = [...state.cropMachine.queue];
  newQueue.splice(index, 1);

  return {
    ...state,
    inventory: inv,
    xp: state.xp + harvestTotal,
    cropMachine: {
      ...state.cropMachine,
      queue: newQueue,
    },
    lastMeaningfulActivity: now,
  };
}

/**
 * Refill oil tank from inventory. 1 oil item = 1 hour.
 */
export function refillOil(state: GameState, qty: number): GameState {
  if (!state.cropMachine) return state;
  if (qty <= 0) return state;

  const oilCount = state.inventory["oil"] ?? 0;
  if (oilCount < qty) return state;

  const space = state.cropMachine.maxOilTank - state.cropMachine.oilTank;
  const toAdd = Math.min(qty, space);
  if (toAdd <= 0) return state;

  const inv = { ...state.inventory };
  inv["oil"] = oilCount - toAdd;
  if (inv["oil"]! <= 0) delete inv["oil"];

  return {
    ...state,
    inventory: inv,
    cropMachine: {
      ...state.cropMachine,
      oilTank: state.cropMachine.oilTank + toAdd,
    },
  };
}
