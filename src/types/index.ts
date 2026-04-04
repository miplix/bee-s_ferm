// === Player ===
export interface Player {
  account_id: string;
  display_name: string;
  x: number;
  y: number;
  resources: Record<string, number>;
  inventory: InventoryStack[];
  placed_objects: PlacedObject[];
  last_seen: string;
}

// === Inventory: stacked items ===
export interface InventoryStack {
  item_type: string;
  count: number;
}

// === Object placed on the farm grid ===
export interface PlacedObject {
  id: string;
  object_type: string;
  grid_x: number;
  grid_y: number;
  is_scenery: boolean;
  destroy_progress?: number;
  // Crop fields
  crop?: string;           // planted crop type
  plantedAt?: number;      // timestamp when planted
  growthDuration?: number;  // ms to grow
}

// === Dropped resource on the ground ===
export interface DroppedResource {
  id: string;
  resource_type: string;
  amount: number;
  grid_x: number;
  grid_y: number;
}

// === Item definitions ===
export interface ItemDef {
  type: string;
  name: string;
  emoji: string;
  color: string;
  placeable: boolean;
  destroyTime: number;
  dropType?: string;
  dropAmount?: number;
  isField?: boolean; // this is a plantable field
}

// === Crop definition ===
export interface CropDef {
  type: string;
  name: string;
  emoji: string;
  seedEmoji: string;
  growthTime: number;  // ms
  seedPrice: number;   // coins to buy seed
  sellPrice: number;   // coins when selling harvest
  harvestAmount: number;
  xp: number;
  stages: string[];    // emoji per growth stage
}
