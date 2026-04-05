export interface InventoryStack {
  item_type: string; // normalized title used as key for stacking
  count: number;
  name: string;      // display title
  image: string | null;
  tokenIds: string[]; // all token_ids in this stack
}

export interface PlacedObject {
  id: string;        // unique placement id
  item_type: string;
  name: string;
  image: string | null;
  grid_x: number;
  grid_y: number;
}

export interface NftItem {
  token_id: string;
  title: string;
  media: string | null;
}
