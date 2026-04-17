import type { RecipeId, BuildingId } from "../domain/types/ids";

export interface RecipeDef {
  id: RecipeId;
  name: string;
  emoji: string;
  xp: number;                                // XP granted when fed to Bumpkin
  cookingMs: number;                          // cooking time in ms (SFL cookingSeconds × 1000)
  ingredients: { id: string; qty: number }[];
  building: BuildingId;                       // which building is required
}

/**
 * 8 TZ recipes with SFL cooking times.
 * Source: TZ 2.2 + research/05_cooking_greenhouse_flowers_fruits.md
 */
export const RECIPES: readonly RecipeDef[] = [
  {
    id: "pumpkin_soup", name: "Pumpkin Soup", emoji: "🍲", xp: 24,
    cookingMs: 30_000,  // 30s (Fire Pit basic)
    ingredients: [{ id: "pumpkin", qty: 1 }],
    building: "campfire",
  },
  {
    id: "mashed_potato", name: "Mashed Potato", emoji: "🥣", xp: 18,
    cookingMs: 30_000,
    ingredients: [{ id: "potato", qty: 3 }],
    building: "campfire",
  },
  {
    id: "sunflower_cracker", name: "Sunflower Cracker", emoji: "🍪", xp: 13,
    cookingMs: 20_000,
    ingredients: [{ id: "sunflower", qty: 5 }],
    building: "campfire",
  },
  {
    id: "farmer_salad", name: "Farmer Salad", emoji: "🥗", xp: 48,
    cookingMs: 300_000, // 5 min (Kitchen)
    ingredients: [{ id: "carrot", qty: 5 }, { id: "cabbage", qty: 3 }],
    building: "kitchen",
  },
  {
    id: "fried_cabbage", name: "Fried Cabbage", emoji: "🥬", xp: 35,
    cookingMs: 300_000,
    ingredients: [{ id: "cabbage", qty: 5 }],
    building: "kitchen",
  },
  {
    id: "milk_porridge", name: "Milk Porridge", emoji: "🥛", xp: 60,
    cookingMs: 600_000, // 10 min (Kitchen)
    ingredients: [{ id: "wheat", qty: 2 }, { id: "milk", qty: 1 }],
    building: "kitchen",
  },
  {
    id: "beet_cake", name: "Beet Cake", emoji: "🎂", xp: 80,
    cookingMs: 1_200_000, // 20 min (Bakery)
    ingredients: [{ id: "beetroot", qty: 5 }, { id: "egg", qty: 3 }, { id: "wheat", qty: 2 }],
    building: "bakery",
  },
  {
    id: "honey_pie", name: "Honey Pie", emoji: "🍯", xp: 120,
    cookingMs: 1_800_000, // 30 min (Bakery)
    ingredients: [{ id: "wheat", qty: 3 }, { id: "egg", qty: 2 }, { id: "honey", qty: 1 }],
    building: "bakery",
  },
] satisfies RecipeDef[];

export function getRecipeDef(id: RecipeId): RecipeDef {
  const r = RECIPES.find((r) => r.id === id);
  if (!r) throw new Error(`Unknown recipe: ${id}`);
  return r;
}
