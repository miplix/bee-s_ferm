import type { GameState, TradeListing } from "../../domain/types/game";
import { TRADEABLE_ITEMS, MARKETPLACE_TAX, MIN_TRADE_AMOUNT } from "../../data/trading.data";

/**
 * Create a trade listing. Removes items from inventory and places on market.
 * NOTE: buying from other players requires a backend and is stub-only.
 */
export function createListing(
  state: GameState,
  itemId: string,
  qty: number,
  pricePerUnit: number,
  now: number,
): GameState {
  if (qty < MIN_TRADE_AMOUNT) return state;
  if (pricePerUnit <= 0) return state;

  // Validate tradeable
  if (!TRADEABLE_ITEMS.includes(itemId)) return state;

  // Check inventory
  const owned = state.inventory[itemId] ?? 0;
  if (owned < qty) return state;

  // Deduct items
  const inv = { ...state.inventory };
  inv[itemId] = owned - qty;
  if (inv[itemId]! <= 0) delete inv[itemId];

  const listing: TradeListing = {
    id: `trade_${now}_${Math.random().toString(36).slice(2, 8)}`,
    sellerId: state.seed, // use game seed as local "player id"
    itemId,
    qty,
    pricePerUnit,
    createdAt: now,
  };

  return {
    ...state,
    inventory: inv,
    tradeListings: [...state.tradeListings, listing],
    lastMeaningfulActivity: now,
  };
}

/**
 * Cancel a listing and return items to inventory.
 */
export function cancelListing(
  state: GameState,
  listingId: string,
): GameState {
  const idx = state.tradeListings.findIndex((l) => l.id === listingId);
  if (idx < 0) return state;

  const listing = state.tradeListings[idx];

  // Return items to inventory
  const inv = { ...state.inventory };
  inv[listing.itemId] = (inv[listing.itemId] ?? 0) + listing.qty;

  const newListings = [...state.tradeListings];
  newListings.splice(idx, 1);

  return {
    ...state,
    inventory: inv,
    tradeListings: newListings,
  };
}

/**
 * Buy a listing (local mode — no backend).
 * Deducts coins, adds items, removes listing.
 * In production this would be replaced by a Supabase Edge Function call.
 */
export function buyListing(
  state: GameState,
  listingId: string,
  now: number,
): GameState {
  const idx = state.tradeListings.findIndex((l) => l.id === listingId);
  if (idx < 0) return state;

  const listing = state.tradeListings[idx];
  const totalCost = parseFloat((listing.qty * listing.pricePerUnit).toFixed(4));
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[listing.itemId] = (inv[listing.itemId] ?? 0) + listing.qty;

  const newListings = [...state.tradeListings];
  newListings.splice(idx, 1);

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
    tradeListings: newListings,
    lastMeaningfulActivity: now,
  };
}

export { MARKETPLACE_TAX };
