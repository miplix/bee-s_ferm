export const TILE_SIZE = 64;
export const MAP_WIDTH = 20;  // tiles
export const MAP_HEIGHT = 15; // tiles
export const PLAYER_SPEED = 200;

export const RESOURCE_YIELD: Record<string, { resource: string; amount: number; cooldown: number }> = {
  tree:  { resource: "wood",  amount: 2, cooldown: 5000 },
  mine:  { resource: "stone", amount: 1, cooldown: 8000 },
  field: { resource: "wheat", amount: 3, cooldown: 4000 },
  gold_mine: { resource: "gold", amount: 1, cooldown: 12000 },
  iron_mine: { resource: "iron", amount: 1, cooldown: 10000 },
};

// Craft recipes: input resources -> output resource
export const CRAFT_RECIPES: Record<string, { inputs: Record<string, number>; output: { resource: string; amount: number } }> = {
  plank:   { inputs: { wood: 5 }, output: { resource: "plank", amount: 2 } },
  tool:    { inputs: { iron: 3, wood: 2 }, output: { resource: "tool", amount: 1 } },
  jewelry: { inputs: { gold: 5, iron: 1 }, output: { resource: "jewelry", amount: 1 } },
};
