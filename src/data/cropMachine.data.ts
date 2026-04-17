/**
 * Crop Machine — automated crop growing using oil.
 * Unlocks at level 35, requires Desert Island.
 * Source: research/07_fishing_compost_cropmachine.md
 */

export interface CropMachineDef {
  buildCost: Record<string, number>;
  level: number;
  requiredIsland: string;
  baseQueueSlots: number;      // 5 base
  maxQueueSlots: number;       // 10 with skill
  basePlots: number;           // 10 base
  maxPlots: number;            // 15 with skill
  oilPerHour: number;          // 1 oil/hour base
  tankCapacityHours: number;   // 48h base
}

export const CROP_MACHINE: CropMachineDef = {
  buildCost: { coins: 8000, wood: 1250, iron: 125, crimstone: 50 },
  level: 35,
  requiredIsland: "desert",
  baseQueueSlots: 5,
  maxQueueSlots: 10,
  basePlots: 10,
  maxPlots: 15,
  oilPerHour: 1,
  tankCapacityHours: 48,
};

/** Crops allowed in the machine (progressive unlock). */
export const MACHINE_CROPS: readonly string[] = [
  "sunflower", "potato", "pumpkin",    // tier 1
  "rhubarb", "zucchini",              // tier 2
  "carrot", "cabbage",                // tier 3
  "yam", "broccoli",                  // tier 4
];
