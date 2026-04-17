import type { GameState } from "../../domain/types/game";
import type { RecipeId } from "../../domain/types/ids";
import { getRecipeDef } from "../../data/recipes.data";

/** Start cooking a recipe. Consumes ingredients immediately. */
export function startCooking(
  state: GameState,
  recipeId: RecipeId,
  now: number,
): GameState {
  const recipe = getRecipeDef(recipeId);

  // Check building
  if (!state.buildings.includes(recipe.building)) return state;

  // Check ingredients
  const inv = { ...state.inventory };
  for (const { id, qty } of recipe.ingredients) {
    if ((inv[id] ?? 0) < qty) return state;
  }

  // Consume ingredients
  for (const { id, qty } of recipe.ingredients) {
    inv[id] = (inv[id] ?? 0) - qty;
    if (inv[id]! <= 0) delete inv[id];
  }

  // Add to cooking slots
  const cookingSlots = [
    ...state.cookingSlots,
    { recipeId, startedAt: now, durationMs: recipe.cookingMs },
  ];

  return {
    ...state,
    inventory: inv,
    cookingSlots,
    lastMeaningfulActivity: now,
  };
}

/** Collect a finished meal. Adds meal item to inventory. */
export function collectMeal(
  state: GameState,
  slotIndex: number,
  now: number,
): GameState {
  const slot = state.cookingSlots[slotIndex];
  if (!slot) return state;
  if (now < slot.startedAt + slot.durationMs) return state; // not ready

  const inv = { ...state.inventory };
  const mealId = `meal_${slot.recipeId}`;
  inv[mealId] = (inv[mealId] ?? 0) + 1;

  const cookingSlots = state.cookingSlots.filter((_, i) => i !== slotIndex);

  return { ...state, inventory: inv, cookingSlots };
}

/**
 * Feed Bumpkin with a cooked meal. This is the ONLY source of XP (R1.2).
 * Consumes the meal item and grants XP.
 */
export function feedBumpkin(
  state: GameState,
  recipeId: RecipeId,
  now: number,
): GameState {
  const recipe = getRecipeDef(recipeId);
  const mealId = `meal_${recipeId}`;
  const count = state.inventory[mealId] ?? 0;
  if (count < 1) return state;

  const inv = { ...state.inventory };
  inv[mealId] = count - 1;
  if (inv[mealId]! <= 0) delete inv[mealId];

  return {
    ...state,
    xp: state.xp + recipe.xp,
    inventory: inv,
    lastMeaningfulActivity: now,
  };
}
