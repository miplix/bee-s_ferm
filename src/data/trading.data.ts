/**
 * Trading marketplace data — P2P trading (MVP stubs).
 * Source: research/10_economy_shop_trading.md
 */

/** Items allowed for trading (crops, resources, animal products, fruits). */
export const TRADEABLE_ITEMS: readonly string[] = Object.freeze([
  // crops
  "sunflower", "potato", "pumpkin", "carrot", "cabbage", "wheat", "kale",
  // resources
  "wood", "stone", "iron", "gold",
  // animal products
  "egg", "milk", "wool", "honey",
  // fruits
  "tomato", "lemon", "blueberry", "orange", "apple", "banana",
]);

/** Marketplace tax: 10% deducted from seller proceeds. */
export const MARKETPLACE_TAX = 0.10;

/** Minimum quantity per trade listing. */
export const MIN_TRADE_AMOUNT = 1;
