import type { ToolId } from "../domain/types/ids";

export interface ToolDef {
  id: ToolId;
  name: string;
  emoji: string;
  cost: Record<string, number>;  // crafting cost (coins + resources)
  forResource: string;           // what node type it harvests
}

/**
 * Tools — updated recipes per user spec:
 * - Axe: 20 coins (only coins)
 * - Wooden Pickaxe (stone): 3 wood + coins
 * - Stone Pickaxe (iron): stone + wood + coins
 * - Iron Pickaxe (gold): iron + stone + wood
 * - Gold Pickaxe (crimstone etc): gold + iron + stone + wood
 */
export const TOOLS: readonly ToolDef[] = [
  { id: "axe",            name: "Axe",              emoji: "🪓", cost: { coins: 20 },                                    forResource: "tree" },
  { id: "stone_pickaxe",  name: "Wooden Pickaxe",   emoji: "⛏️", cost: { wood: 3, coins: 10 },                           forResource: "rock" },
  { id: "iron_pickaxe",   name: "Stone Pickaxe",    emoji: "⛏️", cost: { stone: 3, wood: 3, coins: 20 },                 forResource: "iron" },
  { id: "gold_pickaxe",   name: "Iron Pickaxe",     emoji: "⛏️", cost: { iron: 3, stone: 3, wood: 3 },                   forResource: "gold" },
  { id: "fishing_rod",    name: "Fishing Rod",      emoji: "🎣", cost: { wood: 3, coins: 10 },                           forResource: "fish" },
] satisfies ToolDef[];

export function getToolDef(id: ToolId): ToolDef {
  const t = TOOLS.find((t) => t.id === id);
  if (!t) throw new Error(`Unknown tool: ${id}`);
  return t;
}

/** Extra node→tool mappings (nodes that share a tool with another node type). */
const EXTRA_NODE_TOOLS: Record<string, ToolId> = {
  crimstone:     "gold_pickaxe",
  oil_reserve:   "gold_pickaxe",
  obsidian_rock: "gold_pickaxe",
  sunstone_rock: "gold_pickaxe",
  lava_pit:      "gold_pickaxe",
};

/** Which tool is needed for a given node type? */
export function toolForNode(nodeType: string): ToolId | null {
  if (EXTRA_NODE_TOOLS[nodeType]) return EXTRA_NODE_TOOLS[nodeType];
  const t = TOOLS.find((t) => t.forResource === nodeType);
  return t?.id ?? null;
}
