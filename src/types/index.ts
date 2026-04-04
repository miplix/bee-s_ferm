// === Player ===
export interface Player {
  account_id: string;
  display_name: string;
  x: number;
  y: number;
  resources: Record<string, number>;
  last_seen: string;
}

// === Placed objects on player's farm ===
export interface PlacedObject {
  id: string;
  owner_id: string;
  nft_token_id: string;
  object_type: string;
  grid_x: number;
  grid_y: number;
  state: Record<string, unknown>;
  placed_at: string;
}

// === Inventory item (NFT reference) ===
export interface InventoryItem {
  token_id: string;
  name: string;
  icon: string;
  object_type: string; // "tree", "mine", "field", etc.
  metadata: Record<string, unknown>;
}

// === Resource types ===
export type ResourceType = "wood" | "stone" | "gold" | "wheat" | "iron";

// === Game events for realtime ===
export interface PlayerPresence {
  account_id: string;
  x: number;
  y: number;
  display_name: string;
}
