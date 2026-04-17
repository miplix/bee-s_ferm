// Chore Board — daily tasks with rewards.
// 3 chores selected daily via seeded PRNG, reset at midnight.

export interface ChoreDef {
  id: string;
  description: string;
  requirement: {
    type: "harvest" | "cook" | "sell" | "gather";
    target?: string;   // specific item id (optional — any item of that type if omitted)
    qty: number;
  };
  reward: { coins: number; xp: number };
}

/** Pool of ~15 chore templates. */
export const CHORES: readonly ChoreDef[] = Object.freeze([
  // Harvest chores
  { id: "chore_harvest_any_5",       description: "Harvest 5 crops",                  requirement: { type: "harvest", qty: 5 },                        reward: { coins: 3, xp: 80 } },
  { id: "chore_harvest_any_15",      description: "Harvest 15 crops",                 requirement: { type: "harvest", qty: 15 },                       reward: { coins: 8, xp: 200 } },
  { id: "chore_harvest_sunflower_10",description: "Harvest 10 sunflowers",            requirement: { type: "harvest", target: "sunflower", qty: 10 },  reward: { coins: 2, xp: 60 } },
  { id: "chore_harvest_potato_5",    description: "Harvest 5 potatoes",               requirement: { type: "harvest", target: "potato", qty: 5 },      reward: { coins: 3, xp: 80 } },
  { id: "chore_harvest_carrot_5",    description: "Harvest 5 carrots",                requirement: { type: "harvest", target: "carrot", qty: 5 },      reward: { coins: 5, xp: 120 } },

  // Cook chores
  { id: "chore_cook_any_2",          description: "Cook 2 meals",                     requirement: { type: "cook", qty: 2 },                           reward: { coins: 6, xp: 150 } },
  { id: "chore_cook_any_5",          description: "Cook 5 meals",                     requirement: { type: "cook", qty: 5 },                           reward: { coins: 15, xp: 350 } },
  { id: "chore_cook_soup",           description: "Cook 1 pumpkin soup",              requirement: { type: "cook", target: "pumpkin_soup", qty: 1 },   reward: { coins: 8, xp: 200 } },

  // Sell chores
  { id: "chore_sell_any_10",         description: "Sell 10 items at Market",           requirement: { type: "sell", qty: 10 },                          reward: { coins: 4, xp: 100 } },
  { id: "chore_sell_any_30",         description: "Sell 30 items at Market",           requirement: { type: "sell", qty: 30 },                          reward: { coins: 10, xp: 250 } },
  { id: "chore_sell_fish_3",         description: "Sell 3 fish",                       requirement: { type: "sell", target: "fish", qty: 3 },           reward: { coins: 6, xp: 150 } },

  // Gather chores
  { id: "chore_gather_wood_10",      description: "Gather 10 wood",                   requirement: { type: "gather", qty: 10 },                        reward: { coins: 3, xp: 80 } },
  { id: "chore_gather_stone_5",      description: "Gather 5 stone",                   requirement: { type: "gather", target: "stone", qty: 5 },        reward: { coins: 4, xp: 100 } },
  { id: "chore_gather_iron_3",       description: "Gather 3 iron",                    requirement: { type: "gather", target: "iron", qty: 3 },         reward: { coins: 6, xp: 150 } },
  { id: "chore_gather_any_20",       description: "Gather 20 resources",              requirement: { type: "gather", qty: 20 },                        reward: { coins: 8, xp: 200 } },
]);

/** Number of chores active per day. */
export const DAILY_CHORE_COUNT = 3;
