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
  is_scenery: boolean; // trees, rocks — can't move, must destroy
  destroy_progress?: number; // 0-100, when 100 → drops resource
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
  destroyTime: number; // ms to destroy (0 = instant pickup)
  dropType?: string;   // what resource drops when destroyed
  dropAmount?: number;
}

// === Game state ===
export interface GameState {
  player: Player;
  grid: (PlacedObject | null)[][];
  drops: DroppedResource[];
  mode: "idle" | "placing" | "moving";
  selectedInventoryItem: string | null;
  selectedObject: PlacedObject | null;
  placementPreview: { x: number; y: number; valid: boolean } | null;
}
