import type {
  CropId, BuildingId, AnimalKind, IslandId,
  PanelId, LocationId, CellType,
  FruitId, FlowerId, GreenhouseCropId,
} from "./ids";
import { STARTING_BLOCKS, BLOCK_SIZE, type BlockPos } from "../expansion/blocks";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";

// --- Cells (grid) ---

export interface Cell {
  type: CellType;
  // Multi-cell footprint (buildings=2x2, trees=2x2, default=1x1)
  w?: number;                      // width in cells (default 1)
  h?: number;                      // height in cells (default 1)
  parentKey?: string;              // occupied child → points to top-left parent key "cx,cy"
  // plot
  cropId?: CropId | null;
  plantedAt?: number | null;       // ms timestamp
  effectiveGrowMs?: number | null;  // boosted grow time (null = use crop default)
  fertilizerId?: string | null;     // applied fertilizer id
  fertilizedAt?: number | null;     // ms timestamp when fertilizer applied
  fertilizerUntil?: number | null;  // ms timestamp when fertilizer expires
  // resource node
  lastHarvest?: number;            // ms timestamp of last gather
  hitsLeft?: number;               // -1 = infinite (trees), N = remaining nodes
  currentHits?: number;            // hits applied to current gather (0 = fresh)
  lastHitAt?: number;              // timestamp of last hit (for 5s idle reset)
  // building
  buildingId?: BuildingId;
  // beehive
  beehiveIdx?: number;
  // fruit patch
  fruitId?: FruitId | null;
  fruitPlantedAt?: number | null;
  fruitHarvestsLeft?: number | null;
  lastFruitHarvest?: number | null;
  fruitStump?: boolean;             // true after final harvest until cut down with axe

  // Pollen boost (×2 yield while active, prorated at harvest)
  pollenBoostUntil?: number | null;     // unix ms when boost expires
  pollenBoostStartedAt?: number | null; // unix ms when applied
  // flower bed
  flowerId?: FlowerId | null;
  flowerPlantedAt?: number | null;
  // greenhouse
  greenhouseCropId?: GreenhouseCropId | null;
  greenhousePlantedAt?: number | null;
}

// --- Animals ---

export interface AnimalState {
  id: string;
  kind: AnimalKind;
  xp: number;
  bornAt: number;
  lastFed: number;
  lastCollect: number;
  diseased: boolean;
  favoriteFeed?: string;
}

// --- Beehives ---

export interface BeehiveState {
  id: string;
  level: number;
  actions: number;
  lastAction: number;
  createdAt: number;
  x?: number;
  y?: number;
  accruedPollen: number;
  lastAccrualAt: number;
}

// --- Pets ---

export interface PetState {
  id: string;
  xp: number;
  lastNap: number;   // ms timestamp
  adoptedAt: number; // ms timestamp
}

// --- Shop tracking ---

export interface ShopRecord {
  weekly: number;
  daily: number;
  lastDay: string;
  lastWeek: string;
}

// --- Cooking ---

export interface CookingSlot {
  recipeId: string;
  startedAt: number;
  durationMs: number;
}

// --- Fishing ---

export interface FishingState {
  castsToday: number;
  lastResetDay: string;   // ISO date string for daily reset
}

// --- Compost slots ---

export interface CompostSlot {
  id: string;          // composter definition id
  startedAt: number;   // ms timestamp
  durationMs: number;  // how long to compost
}

// --- Pending expansion (build timer) ---

export interface PendingExpansion {
  expansionIndex: number;
  startedAt: number;
  durationMs: number;
  blockPos: BlockPos;
}

// --- Deliveries ---

export interface ActiveDelivery {
  id: string;
  defId: string;
  npcName: string;
  npcEmoji: string;
  request: { itemId: string; qty: number }[];
  reward: { coins: number; xp: number; tickets: number };
  expiresAt: number;
}

export interface DeliveryState {
  active: ActiveDelivery[];
  lastRefresh: number;      // ms timestamp of last full refresh
  completed: number;        // lifetime completed count
}

// --- Chores ---

export interface ChoreProgress {
  choreId: string;
  description: string;
  requirement: { type: "harvest" | "cook" | "sell" | "gather"; target?: string; qty: number };
  reward: { coins: number; xp: number };
  progress: number;         // current progress toward qty
  claimed: boolean;         // reward already claimed
}

export interface ChoreState {
  active: ChoreProgress[];
  lastResetDay: string;     // ISO date "YYYY-MM-DD"
}

// --- Daily Reward ---

export interface DailyRewardState {
  lastClaimDay: string;     // ISO date "YYYY-MM-DD"
  streak: number;           // current streak (1-7, wraps)
}

// --- Crop Machine ---

export interface CropMachineQueueItem {
  cropId: string;
  qty: number;
  startedAt: number;
  durationMs: number;
}

export interface CropMachineState {
  built: boolean;
  queue: CropMachineQueueItem[];
  oilTank: number;      // hours of oil remaining
  maxOilTank: number;
}

// --- Trading ---

export interface TradeListing {
  id: string;
  sellerId: string;
  itemId: string;
  qty: number;
  pricePerUnit: number; // in coins
  createdAt: number;
}

// --- Active totem (time warp) ---

export interface ActiveTotem {
  type: string;        // totem id
  activatedAt: number; // ms timestamp
  durationMs: number;  // how long it lasts
}

// --- Main game state ---

export interface GameState {
  version: number;
  seed: string;
  createdAt: number;
  lastSavedAt: number;

  // character
  xp: number;
  coins: number;
  pollen: number;
  gems: number;

  // world
  island: IslandId;
  blocks: BlockPos[];               // unlocked 3x3 blocks
  cells: Record<string, Cell>;      // sparse map: "cx,cy" -> Cell
  expansion: number;                // how many expansions completed
  pendingExpansion: PendingExpansion | null;
  seasonAnchor: number;             // ms timestamp — season 0 (spring) started here

  // inventories
  inventory: Record<string, number>;
  shopPurchases: Record<string, ShopRecord>;

  // structures
  buildings: BuildingId[];
  buildingLevels: Record<string, number>;   // buildingId -> level (default 1 when built)
  animals: AnimalState[];
  beehives: BeehiveState[];

  // cooking
  cookingSlots: CookingSlot[];

  // composting
  compostSlots: CompostSlot[];

  // fishing
  fishingState: FishingState;

  // UI
  quickbar: string[];
  selectedTool: string | null;
  activePanel: PanelId | null;
  activeLocation: LocationId;
  moveMode: boolean;                    // drag/move mode active
  moveSource: string | null;            // "cx,cy" of cell being moved

  // skills
  skills: Record<string, boolean>;   // skillId -> learned
  skillPoints: number;               // available unspent points

  // deliveries, chores, daily reward
  deliveries: DeliveryState;
  chores: ChoreState;
  dailyReward: DailyRewardState;

  // collectibles & totems
  collectibles: string[];              // placed collectible IDs
  activeTotem: ActiveTotem | null;     // currently active time warp totem

  // crop machine
  cropMachine: CropMachineState | null;

  // trading marketplace
  tradeListings: TradeListing[];

  // factions
  faction: string | null;
  pets: string[];                      // legacy (deprecated, kept for save migration)
  petStates: Record<string, PetState>; // legacy (deprecated)

  // Items waiting to be placed on the farm (overflow from expansions)
  // Each entry = type of cell that needs placement, count.
  pendingPlacements: Record<string, number>;

  // anti-bot
  lastMeaningfulActivity: number;

  // VIP subscription (gives +1 beehive slot + free first hive + VIP daily chest)
  vipExpiresAt?: number | null;
  vipChest?: { lastClaimDay: string; streak: number } | null; // daily VIP chest tracking
  // Hash list of NEAR txes already credited (prevent replay)
  processedTxHashes?: string[];

  // NEAR (Etap 8)
  nearAccount?: string | null;
}

// --- Cell key helper ---

export function cellKey(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

// --- Initial state factory ---

/** Place a 1x1 cell. */
function put1(cells: Record<string, Cell>, cx: number, cy: number, cell: Cell) {
  cells[cellKey(cx, cy)] = cell;
}

/** Place a 2x2 cell (parent at top-left, 3 children reference it). */
function put2x2(cells: Record<string, Cell>, cx: number, cy: number, cell: Cell) {
  const pKey = cellKey(cx, cy);
  cells[pKey] = { ...cell, w: 2, h: 2 };
  cells[cellKey(cx + 1, cy)] = { type: cell.type, parentKey: pKey, buildingId: cell.buildingId };
  cells[cellKey(cx, cy + 1)] = { type: cell.type, parentKey: pKey, buildingId: cell.buildingId };
  cells[cellKey(cx + 1, cy + 1)] = { type: cell.type, parentKey: pKey, buildingId: cell.buildingId };
}

export function createInitialState(): GameState {
  const now = Date.now();
  const blocks = [...STARTING_BLOCKS];
  const cells: Record<string, Cell> = {};

  // 4 starting blocks (2x2) = 6x6 = 36 cells
  // ALL objects 2x2 (FIXED RULE). Plots 1x1.
  // 3 trees(12) + 3 buildings(12) + 5 plots(5) = 29/36. 7 free.
  //
  // Layout (6 cols x 6 rows):
  //   0   1   2   3   4   5
  // 0 [Tree1-] [Tree2-] 🟫 🟫
  // 1 [-----] [-----] 🟫  ·
  // 2 [Tree3-]  ·   ·  🟫  🟫
  // 3 [-----]  ·   ·   ·   ·
  // 4 [Market] [WorkB-] [Camp--]
  // 5 [-----] [-----] [-----]

  // Tree 1 at (0,0)
  put2x2(cells, 0, 0, { type: "tree", hitsLeft: -1, lastHarvest: 0 });
  // Tree 2 at (2,0)
  put2x2(cells, 2, 0, { type: "tree", hitsLeft: -1, lastHarvest: 0 });
  // Plots in top-right
  put1(cells, 4, 0, { type: "plot" });
  put1(cells, 5, 0, { type: "plot" });
  put1(cells, 4, 1, { type: "plot" });

  // Tree 3 at (0,2)
  put2x2(cells, 0, 2, { type: "tree", hitsLeft: -1, lastHarvest: 0 });
  // Daily chest in middle of farm
  put1(cells, 3, 3, { type: "daily_chest" });
  // Plots right of tree 3
  put1(cells, 4, 2, { type: "plot" });
  put1(cells, 5, 2, { type: "plot" });

  // Market (2x2) at (0,4)
  put2x2(cells, 0, 4, { type: "building", buildingId: "market" });
  // Workbench (2x2) at (2,4)
  put2x2(cells, 2, 4, { type: "building", buildingId: "workbench" });
  // Campfire (2x2) at (4,4)
  put2x2(cells, 4, 4, { type: "building", buildingId: "campfire" });

  return {
    version: 1,
    seed: crypto.randomUUID(),
    createdAt: now,
    lastSavedAt: now,

    xp: 0,
    coins: 0,
    pollen: 0,
    gems: 0,

    island: "basic",
    blocks,
    cells,
    expansion: 0,
    pendingExpansion: null,
    seasonAnchor: now,  // spring starts when account is created

    inventory: {
      axe: 5,                   // starter tools
      sunflower_seed: 10,
      potato_seed: 5,
    },
    shopPurchases: {},

    buildings: ["workbench", "market", "campfire"],
    buildingLevels: {},
    animals: [],
    beehives: [],

    cookingSlots: [],
    compostSlots: [],

    fishingState: {
      castsToday: 0,
      lastResetDay: new Date(now).toISOString().slice(0, 10),
    },

    quickbar: [],
    selectedTool: null,
    activePanel: null,
    activeLocation: "farm",
    moveMode: false,
    moveSource: null,

    skills: {},
    skillPoints: 0,

    deliveries: {
      active: [],
      lastRefresh: 0,
      completed: 0,
    },
    chores: {
      active: [],
      lastResetDay: "",
    },
    dailyReward: {
      lastClaimDay: "",
      streak: 0,
    },

    collectibles: [],
    activeTotem: null,

    cropMachine: null,
    tradeListings: [],

    faction: null,
    pets: [],
    petStates: {},
    pendingPlacements: {},
    vipExpiresAt: null,
    vipChest: null,
    processedTxHashes: [],

    lastMeaningfulActivity: now,
    nearAccount: null,
  };
}
