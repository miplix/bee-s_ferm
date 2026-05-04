import type { IslandId } from "../domain/types/ids";

export interface ExpansionAdds {
  plots: number;
  trees?: number;
  rocks?: number;
  iron?: number;
  gold?: number;
  crimstone?: number;
  flower_beds?: number;
  fruit_patches?: number;
  oil_reserve?: number;
  greenhouse?: number;
  obsidian_rock?: number;
  sunstone_rock?: number;
  lava_pit?: number;
}

export interface ExpansionDef {
  id: number;
  minLevel: number;
  cost: Record<string, number>;
  adds: ExpansionAdds;
}

// --- Basic Island (9 expansions) ---

export const EXPANSIONS: readonly ExpansionDef[] = [
  { id: 1, minLevel: 1,  cost: { wood: 5 },                                     adds: { plots: 3, trees: 2 } },
  { id: 2, minLevel: 3,  cost: { wood: 10, coins: 0.10 },                        adds: { plots: 4, trees: 2, rocks: 1 } },
  { id: 3, minLevel: 5,  cost: { wood: 15, stone: 5 },                           adds: { plots: 4, trees: 1, rocks: 2 } },
  { id: 4, minLevel: 7,  cost: { wood: 20, stone: 10, coins: 0.25 },             adds: { plots: 5, trees: 2, rocks: 2, iron: 1 } },
  { id: 5, minLevel: 8,  cost: { wood: 30, stone: 15, iron: 3 },                 adds: { plots: 5, trees: 2, rocks: 2, iron: 1 } },
  { id: 6, minLevel: 9,  cost: { wood: 35, stone: 20, iron: 5, gold: 1 },        adds: { plots: 6, trees: 3, rocks: 2, gold: 1 } },
  { id: 7, minLevel: 10, cost: { wood: 40, stone: 25, iron: 7, gold: 1 },        adds: { plots: 6, trees: 3, rocks: 2, iron: 1, gold: 1 } },
  { id: 8, minLevel: 11, cost: { wood: 50, stone: 30, iron: 9, gold: 1 },        adds: { plots: 7, trees: 3, rocks: 3, iron: 2 } },
  { id: 9, minLevel: 11, cost: { wood: 60, stone: 35, iron: 9, gold: 1 },        adds: { plots: 8, trees: 4, rocks: 3, iron: 2, gold: 1 } },
] satisfies ExpansionDef[];

// --- Spring Island (20 expansions) ---

export const SPRING_EXPANSIONS: readonly ExpansionDef[] = [
  // fruit_patch is 2x2 (= 4 cells), tree is 2x2 (= 4 cells), so block 9 cells fits one of each
  { id:  1, minLevel: 11, cost: { wood: 30,  stone: 15 },                                       adds: { plots: 3, trees: 0, crimstone: 1, flower_beds: 1, fruit_patches: 1 } },
  { id:  2, minLevel: 12, cost: { wood: 40,  stone: 20 },                                       adds: { plots: 2, trees: 0, crimstone: 1, flower_beds: 2, fruit_patches: 1 } },
  { id:  3, minLevel: 13, cost: { wood: 50,  stone: 25 },                                       adds: { plots: 1, trees: 0, crimstone: 1, flower_beds: 2, fruit_patches: 1 } },
  // Each expansion fills exactly one 3×3 block (9 cells). 2x2 = tree, fruit_patch (4 cells each).
  { id:  4, minLevel: 14, cost: { wood: 55,  stone: 30,  crimstone: 1 },                        adds: { plots: 4, trees: 1, crimstone: 1 } },                               // 4+4+1 = 9
  { id:  5, minLevel: 14, cost: { wood: 60,  stone: 35,  crimstone: 2 },                        adds: { plots: 3, trees: 1, crimstone: 1, flower_beds: 1 } },               // 3+4+1+1 = 9
  { id:  6, minLevel: 15, cost: { wood: 70,  stone: 40,  iron: 5,  crimstone: 3 },              adds: { plots: 4, trees: 1, flower_beds: 1 } },                             // 4+4+1 = 9
  { id:  7, minLevel: 16, cost: { wood: 80,  stone: 45,  iron: 8,  crimstone: 4 },              adds: { plots: 2, trees: 1, crimstone: 1, flower_beds: 2 } },               // 2+4+1+2 = 9
  { id:  8, minLevel: 17, cost: { wood: 85,  stone: 50,  iron: 10, crimstone: 5 },              adds: { plots: 5, trees: 1 } },                                             // 5+4 = 9
  { id:  9, minLevel: 18, cost: { wood: 90,  stone: 55,  iron: 12, gold: 2,  crimstone: 6 },    adds: { plots: 3, trees: 1, crimstone: 2 } },                               // 3+4+2 = 9
  { id: 10, minLevel: 19, cost: { wood: 100, stone: 60,  iron: 15, gold: 3,  crimstone: 8 },    adds: { plots: 4, trees: 1, flower_beds: 1 } },                             // 4+4+1 = 9
  { id: 11, minLevel: 20, cost: { wood: 100, stone: 70,  iron: 15, gold: 5,  crimstone: 10 },   adds: { plots: 0, trees: 1, fruit_patches: 1, crimstone: 1 } },             // 4+4+1 = 9
  { id: 12, minLevel: 21, cost: { wood: 110, stone: 75,  iron: 18, gold: 6,  crimstone: 12 },   adds: { plots: 5, trees: 1 } },                                             // 5+4 = 9
  { id: 13, minLevel: 22, cost: { wood: 120, stone: 80,  iron: 20, gold: 7,  crimstone: 14 },   adds: { plots: 3, trees: 1, crimstone: 2 } },                               // 3+4+2 = 9
  { id: 14, minLevel: 23, cost: { wood: 130, stone: 85,  iron: 22, gold: 8,  crimstone: 16 },   adds: { plots: 0, trees: 1, fruit_patches: 1, flower_beds: 1 } },           // 4+4+1 = 9
  { id: 15, minLevel: 24, cost: { wood: 140, stone: 90,  iron: 25, gold: 10, crimstone: 18 },   adds: { plots: 4, trees: 1, flower_beds: 1 } },                             // 4+4+1 = 9
  { id: 16, minLevel: 25, cost: { wood: 150, stone: 100, iron: 25, gold: 12, crimstone: 20 },   adds: { plots: 5, trees: 1 } },                                             // 5+4 = 9
  { id: 17, minLevel: 26, cost: { wood: 160, stone: 110, iron: 28, gold: 14, crimstone: 22 },   adds: { plots: 3, trees: 1, crimstone: 1, flower_beds: 1 } },               // 3+4+1+1 = 9
  { id: 18, minLevel: 27, cost: { wood: 180, stone: 120, iron: 30, gold: 16, crimstone: 24 },   adds: { plots: 0, trees: 1, fruit_patches: 1, flower_beds: 1 } },           // 4+4+1 = 9
  { id: 19, minLevel: 28, cost: { wood: 200, stone: 130, iron: 35, gold: 18, crimstone: 26 },   adds: { plots: 5, trees: 1 } },                                             // 5+4 = 9
  { id: 20, minLevel: 30, cost: { wood: 220, stone: 150, iron: 40, gold: 20, crimstone: 30 },   adds: { plots: 3, trees: 1, crimstone: 2 } },                               // 3+4+2 = 9
] satisfies ExpansionDef[];

// --- Desert Island (25 expansions) ---

export const DESERT_EXPANSIONS: readonly ExpansionDef[] = [
  // 9 cells per block. 2x2 = tree, greenhouse (4 cells each).
  { id:  1, minLevel: 30, cost: { crimstone: 5,  gold: 5 },                                              adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 4+4+1 = 9
  { id:  2, minLevel: 31, cost: { crimstone: 8,  gold: 6 },                                              adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id:  3, minLevel: 31, cost: { crimstone: 10, gold: 7 },                                              adds: { plots: 5, oil_reserve: 0, greenhouse: 1 } },                  // 5+4 = 9
  { id:  4, minLevel: 32, cost: { crimstone: 12, gold: 8,  oil: 5 },                                     adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 3+4+2 = 9
  { id:  5, minLevel: 32, cost: { crimstone: 14, gold: 9,  oil: 8 },                                     adds: { plots: 4, oil_reserve: 1, greenhouse: 1 } },                  // 4+1+4 = 9
  { id:  6, minLevel: 33, cost: { crimstone: 16, gold: 10, oil: 10 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id:  7, minLevel: 34, cost: { crimstone: 18, gold: 11, oil: 12 },                                    adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 9
  { id:  8, minLevel: 35, cost: { crimstone: 20, gold: 12, oil: 15 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 5+4 = 9
  { id:  9, minLevel: 35, cost: { crimstone: 22, gold: 13, oil: 18 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 10, minLevel: 36, cost: { crimstone: 24, gold: 14, oil: 20 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
  { id: 11, minLevel: 36, cost: { crimstone: 26, gold: 15, oil: 22 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 12, minLevel: 37, cost: { crimstone: 28, gold: 16, oil: 25 },                                    adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 9
  { id: 13, minLevel: 38, cost: { crimstone: 30, gold: 17, oil: 28 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
  { id: 14, minLevel: 38, cost: { crimstone: 32, gold: 18, oil: 30 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 15, minLevel: 39, cost: { crimstone: 35, gold: 20, oil: 32 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
  { id: 16, minLevel: 39, cost: { crimstone: 38, gold: 22, oil: 35 },                                    adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 9
  { id: 17, minLevel: 40, cost: { crimstone: 40, gold: 24, oil: 38 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 18, minLevel: 40, cost: { crimstone: 42, gold: 26, oil: 40 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
  { id: 19, minLevel: 41, cost: { crimstone: 45, gold: 28, oil: 42 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 20, minLevel: 42, cost: { crimstone: 48, gold: 30, oil: 45 },                                    adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 9
  { id: 21, minLevel: 43, cost: { crimstone: 50, gold: 32, oil: 48 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
  { id: 22, minLevel: 44, cost: { crimstone: 52, gold: 34, oil: 50 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 23, minLevel: 44, cost: { crimstone: 55, gold: 36, oil: 52 },                                    adds: { plots: 3, trees: 1, oil_reserve: 2 } },                       // 9
  { id: 24, minLevel: 45, cost: { crimstone: 58, gold: 38, oil: 55 },                                    adds: { plots: 4, trees: 1, oil_reserve: 1 } },                       // 9
  { id: 25, minLevel: 45, cost: { crimstone: 60, gold: 40, oil: 60 },                                    adds: { plots: 5, greenhouse: 1 } },                                  // 9
] satisfies ExpansionDef[];

// --- Volcano Island (30 expansions) ---

export const VOLCANO_EXPANSIONS: readonly ExpansionDef[] = [
  // 9 cells per block. tree = 4 cells. obsidian/lava/sunstone/plots = 1 cell each.
  { id:  1, minLevel: 40, cost: { oil: 10, gold: 10 },                                                    adds: { plots: 3, trees: 1, obsidian_rock: 1, lava_pit: 1 } },
  { id:  2, minLevel: 41, cost: { oil: 12, obsidian: 2,  gold: 10 },                                      adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 1 } },
  { id:  3, minLevel: 42, cost: { oil: 14, obsidian: 4,  gold: 12 },                                      adds: { plots: 3, trees: 1, obsidian_rock: 1, lava_pit: 1 } },
  { id:  4, minLevel: 43, cost: { oil: 16, obsidian: 6,  gold: 14 },                                      adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 1 } },
  { id:  5, minLevel: 43, cost: { oil: 18, obsidian: 8,  gold: 15 },                                      adds: { plots: 3, trees: 1, obsidian_rock: 1, lava_pit: 1 } },
  { id:  6, minLevel: 44, cost: { oil: 20, obsidian: 10, sunstone: 1, gold: 16 },                         adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 1 } },
  { id:  7, minLevel: 44, cost: { oil: 22, obsidian: 12, sunstone: 2, gold: 18 },                         adds: { plots: 2, trees: 1, obsidian_rock: 2, lava_pit: 1 } },
  { id:  8, minLevel: 45, cost: { oil: 24, obsidian: 14, sunstone: 3, gold: 20 },                         adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 1, sunstone_rock: 1 } },
  { id:  9, minLevel: 46, cost: { oil: 26, obsidian: 16, sunstone: 4, gold: 22 },                         adds: { plots: 3, trees: 1, obsidian_rock: 1, lava_pit: 1 } },
  { id: 10, minLevel: 46, cost: { oil: 28, obsidian: 18, sunstone: 5, gold: 24 },                         adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 2, sunstone_rock: 1 } },
  { id: 11, minLevel: 47, cost: { oil: 30, obsidian: 20, sunstone: 6, gold: 25 },                         adds: { plots: 2, trees: 1, obsidian_rock: 2, lava_pit: 1 } },
  { id: 12, minLevel: 48, cost: { oil: 32, obsidian: 22, sunstone: 7, gold: 26 },                         adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 1, sunstone_rock: 1 } },
  { id: 13, minLevel: 48, cost: { oil: 34, obsidian: 24, sunstone: 8, gold: 28 },                         adds: { plots: 3, trees: 1, obsidian_rock: 1, lava_pit: 1 } },
  { id: 14, minLevel: 49, cost: { oil: 36, obsidian: 26, sunstone: 9, gold: 30 },                         adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 2 } },
  { id: 15, minLevel: 50, cost: { oil: 38, obsidian: 28, sunstone: 10, gold: 32 },                        adds: { plots: 2, trees: 1, obsidian_rock: 2, lava_pit: 1 } },
  { id: 16, minLevel: 50, cost: { oil: 40, obsidian: 30, sunstone: 11, gold: 34 },                        adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 1 } },
  { id: 17, minLevel: 51, cost: { oil: 42, obsidian: 32, sunstone: 12, gold: 36 },                        adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 2 } },
  { id: 18, minLevel: 52, cost: { oil: 44, obsidian: 34, sunstone: 13, gold: 38 },                        adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 2 } },
  { id: 19, minLevel: 52, cost: { oil: 46, obsidian: 36, sunstone: 14, gold: 40 },                        adds: { plots: 2, trees: 1, obsidian_rock: 2, lava_pit: 1 } },
  { id: 20, minLevel: 53, cost: { oil: 48, obsidian: 38, sunstone: 15, gold: 42 },                        adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 2 } },
  { id: 21, minLevel: 54, cost: { oil: 50, obsidian: 40, sunstone: 16, gold: 44 },                        adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 2 } },
  { id: 22, minLevel: 54, cost: { oil: 52, obsidian: 42, sunstone: 17, gold: 46 },                        adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 2 } },
  { id: 23, minLevel: 55, cost: { oil: 54, obsidian: 44, sunstone: 18, gold: 48 },                        adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 2 } },
  { id: 24, minLevel: 56, cost: { oil: 56, obsidian: 46, sunstone: 19, gold: 50 },                        adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 2, sunstone_rock: 1 } },
  { id: 25, minLevel: 56, cost: { oil: 58, obsidian: 48, sunstone: 20, gold: 52 },                        adds: { plots: 2, trees: 1, obsidian_rock: 2, lava_pit: 1 } },
  { id: 26, minLevel: 57, cost: { oil: 60, obsidian: 50, sunstone: 22, gold: 54 },                        adds: { plots: 1, trees: 1, obsidian_rock: 1, lava_pit: 1, sunstone_rock: 2 } },
  { id: 27, minLevel: 58, cost: { oil: 62, obsidian: 52, sunstone: 24, gold: 56 },                        adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 2 } },
  { id: 28, minLevel: 58, cost: { oil: 64, obsidian: 55, sunstone: 26, gold: 58 },                        adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 1, sunstone_rock: 1 } },
  { id: 29, minLevel: 59, cost: { oil: 66, obsidian: 58, sunstone: 28, gold: 60 },                        adds: { plots: 2, trees: 1, obsidian_rock: 1, lava_pit: 2 } },
  { id: 30, minLevel: 60, cost: { oil: 70, obsidian: 60, sunstone: 30, gold: 65 },                        adds: { plots: 1, trees: 1, obsidian_rock: 2, lava_pit: 1, sunstone_rock: 1 } },
] satisfies ExpansionDef[];

/** Returns the expansion list for the given island. */
export function getExpansionList(island: IslandId): readonly ExpansionDef[] {
  if (island === "spring")  return SPRING_EXPANSIONS;
  if (island === "desert")  return DESERT_EXPANSIONS;
  if (island === "volcano") return VOLCANO_EXPANSIONS;
  return EXPANSIONS;
}

/** Island transition costs */
export const ISLAND_TRANSITIONS = Object.freeze({
  spring:  { minLevel: 11, gold: 10 },
  desert:  { minLevel: 30, crimstone: 20 },
  volcano: { minLevel: 40, oil: 50 },
} as const);
