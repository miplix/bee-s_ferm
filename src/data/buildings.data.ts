import type { BuildingId } from "../domain/types/ids";

export interface BuildingDef {
  id: BuildingId;
  name: string;
  emoji: string;
  level: number;         // Bumpkin level to unlock
  cost: Record<string, number>;
  desc: string;
  starter?: boolean;     // built by default
}

export const BUILDINGS: readonly BuildingDef[] = [
  { id: "workbench",  name: "Workbench",     emoji: "🔨", level: 1,  cost: {},                                        desc: "Craft tools and buildings", starter: true },
  { id: "market",     name: "Market",        emoji: "🏪", level: 1,  cost: {},                                        desc: "Buy seeds, sell crops", starter: true },
  { id: "campfire",   name: "Campfire",      emoji: "🔥", level: 2,  cost: { wood: 3, stone: 3 },                     desc: "Cook simple meals (XP)", starter: true },
  { id: "well",       name: "Water Well",    emoji: "🪣", level: 3,  cost: { wood: 5, stone: 5 },                     desc: "Powers extra crop plots" },
  { id: "henhouse",   name: "Hen House",     emoji: "🐔", level: 6,  cost: { wood: 10, stone: 5, coins: 50 },         desc: "Raise up to 10 chickens" },
  { id: "kitchen",    name: "Kitchen",       emoji: "🍳", level: 8,  cost: { wood: 25, stone: 10, iron: 5 },          desc: "Cook medium meals" },
  { id: "feeder",     name: "Feeder",        emoji: "🥣", level: 12, cost: { wood: 15, stone: 10 },                   desc: "Produce animal feed" },
  { id: "barn",       name: "Barn",          emoji: "🐄", level: 12, cost: { wood: 20, stone: 10, iron: 10, coins: 200 }, desc: "Raise cows and sheep" },
  { id: "bakery",     name: "Bakery",        emoji: "🧁", level: 15, cost: { wood: 30, stone: 20, iron: 10, gold: 5 }, desc: "Bake high-XP meals" },
  { id: "toolshed",   name: "Tool Shed",     emoji: "🧰", level: 12, cost: { wood: 25, stone: 15 },                   desc: "x2 tool storage capacity" },
  { id: "bulletin_board", name: "Bulletin Board", emoji: "📋", level: 5,  cost: { wood: 10, stone: 5 },                    desc: "Deliveries and daily chores" },
  { id: "trading_post",   name: "Trading Post",   emoji: "⚖️", level: 10, cost: { wood: 20, stone: 10, iron: 5 },          desc: "Trade with other players" },
  { id: "fishing_dock",   name: "Fishing Dock",   emoji: "🎣", level: 7,  cost: { wood: 15, stone: 5 },                    desc: "Go fishing" },
  { id: "pet_house",      name: "Pet House",      emoji: "🐾", level: 15, cost: { wood: 30, stone: 20, iron: 10, gold: 3 }, desc: "Adopt and manage pets" },
  { id: "town_hall",      name: "Town Hall",      emoji: "🏛️", level: 1,  cost: {},                                        desc: "Faction selection and community" },
] satisfies BuildingDef[];

// --- Building Upgrades ---

export interface BuildingUpgradeDef {
  buildingId: BuildingId;
  fromLevel: number;
  toLevel: number;
  cost: Record<string, number>;
}

export const BUILDING_UPGRADES: readonly BuildingUpgradeDef[] = [
  { buildingId: "henhouse", fromLevel: 1, toLevel: 2, cost: { coins: 7500, wood: 50, stone: 25 } },
  { buildingId: "henhouse", fromLevel: 2, toLevel: 3, cost: { coins: 50000, wood: 200, stone: 100, iron: 20 } },
  { buildingId: "barn", fromLevel: 1, toLevel: 2, cost: { coins: 10000, wood: 100, stone: 50, iron: 10 } },
  { buildingId: "barn", fromLevel: 2, toLevel: 3, cost: { coins: 75000, wood: 300, stone: 150, iron: 50, gold: 5 } },
];

/** Get the upgrade def for a building at the given level, or undefined if max. */
export function getUpgradeDef(buildingId: BuildingId, currentLevel: number): BuildingUpgradeDef | undefined {
  return BUILDING_UPGRADES.find((u) => u.buildingId === buildingId && u.fromLevel === currentLevel);
}

export function getBuildingDef(id: BuildingId): BuildingDef {
  const b = BUILDINGS.find((b) => b.id === id);
  if (!b) throw new Error(`Unknown building: ${id}`);
  return b;
}
