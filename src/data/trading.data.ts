/**
 * Trading marketplace data — P2P trading (MVP stubs).
 * Source: research/10_economy_shop_trading.md
 */

/** Items allowed for trading (crops, resources, animal products, fruits, mutants). */
export const TRADEABLE_ITEMS: readonly string[] = Object.freeze([
  // crops
  "sunflower", "potato", "pumpkin", "carrot", "cabbage", "wheat", "kale",
  // resources
  "wood", "stone", "iron", "gold",
  // animal products
  "egg", "milk", "wool", "honey",
  // fruits
  "tomato", "lemon", "blueberry", "orange", "apple", "banana",
  // rare mutants (high-value collectibles)
  "mutant_sunflower", "mutant_potato", "mutant_pumpkin", "mutant_carrot",
  "mutant_cabbage", "mutant_beetroot", "mutant_corn", "mutant_wheat",
  "mutant_chicken", "mutant_cow", "mutant_sheep",
]);

/** Check if an item is tradeable (works for prefix-based items like mutants). */
export function isTradeable(itemId: string): boolean {
  if (TRADEABLE_ITEMS.includes(itemId)) return true;
  if (itemId.startsWith("mutant_")) return true;
  return false;
}

/** Marketplace tax: 10% deducted from seller proceeds. */
export const MARKETPLACE_TAX = 0.10;

/** Minimum quantity per trade listing. */
export const MIN_TRADE_AMOUNT = 1;
