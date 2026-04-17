/**
 * Basic Island expansions (TZ 4.1).
 * 9 expansions. Each requires resources and adds new nodes.
 */
export interface ExpansionDef {
  id: number;
  minLevel: number;
  cost: Record<string, number>;
  adds: {
    plots: number;
    trees: number;
    rocks: number;
    iron: number;
    gold: number;
  };
}

export const EXPANSIONS: readonly ExpansionDef[] = [
  { id: 1, minLevel: 1,  cost: { wood: 5 },                                      adds: { plots: 3, trees: 2, rocks: 0, iron: 0, gold: 0 } },
  { id: 2, minLevel: 3,  cost: { wood: 10, coins: 0.10 },                         adds: { plots: 4, trees: 2, rocks: 1, iron: 0, gold: 0 } },
  { id: 3, minLevel: 5,  cost: { wood: 15, stone: 5 },                            adds: { plots: 4, trees: 1, rocks: 2, iron: 0, gold: 0 } },
  { id: 4, minLevel: 7,  cost: { wood: 20, stone: 10, coins: 0.25 },              adds: { plots: 5, trees: 2, rocks: 2, iron: 1, gold: 0 } },
  { id: 5, minLevel: 8,  cost: { wood: 30, stone: 15, iron: 3 },                  adds: { plots: 5, trees: 2, rocks: 2, iron: 1, gold: 0 } },
  { id: 6, minLevel: 9,  cost: { wood: 35, stone: 20, iron: 5, gold: 1 },         adds: { plots: 6, trees: 3, rocks: 2, iron: 0, gold: 1 } },
  { id: 7, minLevel: 10, cost: { wood: 40, stone: 25, iron: 7, gold: 1 },         adds: { plots: 6, trees: 3, rocks: 2, iron: 1, gold: 1 } },
  { id: 8, minLevel: 11, cost: { wood: 50, stone: 30, iron: 9, gold: 1 },         adds: { plots: 7, trees: 3, rocks: 3, iron: 2, gold: 0 } },
  { id: 9, minLevel: 11, cost: { wood: 60, stone: 35, iron: 9, gold: 1 },         adds: { plots: 8, trees: 4, rocks: 3, iron: 2, gold: 1 } },
] satisfies ExpansionDef[];

/** Island transition costs */
export const ISLAND_TRANSITIONS = Object.freeze({
  spring: { gold: 10 },   // Basic → Spring
  desert: { crimstone: 20 }, // Spring → Desert
});
