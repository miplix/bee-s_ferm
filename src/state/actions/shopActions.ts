import type { GameState } from "../../domain/types/game";
import type { CropId, ToolId, FruitId, FlowerId, GreenhouseCropId } from "../../domain/types/ids";
import { getCropDef } from "../../data/crops.data";
import { getToolDef } from "../../data/tools.data";
import { getLevel } from "../../domain/level/level";
import { getShopStock, getToday, getWeekStart } from "../../data/shopLimits.data";
import { FRUITS } from "../../data/fruits.data";
import { FLOWERS } from "../../data/flowers.data";
import { GREENHOUSE_CROPS } from "../../data/greenhouse.data";

/** Buy seeds for a crop. Respects shop stock limits. */
export function buySeed(
  state: GameState,
  cropId: CropId,
  qty: number,
  now: number,
): GameState {
  if (qty <= 0) return state;
  const crop = getCropDef(cropId);
  if (getLevel(state.xp) < crop.level) return state;

  const seedId = `${cropId}_seed`;

  // Check shop stock limit
  const stock = getShopStock(seedId, state.shopPurchases, now);
  const actualQty = Math.min(qty, stock.available);
  if (actualQty <= 0) return state;

  const totalCost = crop.seedPrice * actualQty;
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[seedId] = (inv[seedId] ?? 0) + actualQty;

  // Track purchase
  const today = getToday(now);
  const weekStart = getWeekStart(now);
  const prev = state.shopPurchases[seedId] || { weekly: 0, daily: 0, lastDay: "", lastWeek: "" };
  const shopPurchases = {
    ...state.shopPurchases,
    [seedId]: {
      weekly: (prev.lastWeek === weekStart ? prev.weekly : 0) + actualQty,
      daily: (prev.lastDay === today ? prev.daily : 0) + actualQty,
      lastDay: today,
      lastWeek: weekStart,
    },
  };

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
    shopPurchases,
  };
}

/** Buy fruit seeds. */
export function buyFruitSeed(
  state: GameState,
  fruitId: FruitId,
  qty: number,
  now: number,
): GameState {
  if (qty <= 0) return state;
  const fruit = FRUITS.find((f) => f.id === fruitId);
  if (!fruit) return state;
  if (getLevel(state.xp) < fruit.level) return state;

  const seedId = `${fruitId}_seed`;
  const totalCost = fruit.seedPrice * qty;
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[seedId] = (inv[seedId] ?? 0) + qty;

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
  };
}

/** Buy flower seeds. */
export function buyFlowerSeed(
  state: GameState,
  flowerId: FlowerId,
  qty: number,
  now: number,
): GameState {
  if (qty <= 0) return state;
  const flower = FLOWERS.find((f) => f.id === flowerId);
  if (!flower) return state;
  if (getLevel(state.xp) < flower.level) return state;

  const seedId = `${flowerId}_seed`;
  const totalCost = flower.seedPrice * qty;
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[seedId] = (inv[seedId] ?? 0) + qty;

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
  };
}

/** Buy greenhouse crop seeds. */
export function buyGreenhouseSeed(
  state: GameState,
  cropId: GreenhouseCropId,
  qty: number,
  now: number,
): GameState {
  if (qty <= 0) return state;
  const crop = GREENHOUSE_CROPS.find((c) => c.id === cropId);
  if (!crop) return state;
  if (getLevel(state.xp) < crop.level) return state;

  const seedId = `${cropId}_seed`;
  const totalCost = crop.seedPrice * qty;
  if (state.coins < totalCost - 0.001) return state;

  const inv = { ...state.inventory };
  inv[seedId] = (inv[seedId] ?? 0) + qty;

  return {
    ...state,
    coins: parseFloat((state.coins - totalCost).toFixed(4)),
    inventory: inv,
  };
}

/** Sell harvested items for coins. */
export function sell(
  state: GameState,
  itemId: string,
  qty: number,
): GameState {
  if (qty <= 0) return state;
  const current = state.inventory[itemId] ?? 0;
  if (current < qty) return state;

  // Look up sell price — try crops first, then fruits, then greenhouse crops
  let price = 0;
  try {
    const crop = getCropDef(itemId as CropId);
    price = crop.sellPrice;
  } catch {
    // Try fruit
    const fruit = FRUITS.find((f) => f.id === itemId);
    if (fruit) {
      price = fruit.sellPrice;
    } else {
      // Try greenhouse crop
      const ghCrop = GREENHOUSE_CROPS.find((c) => c.id === itemId);
      if (ghCrop) {
        price = ghCrop.sellPrice;
      } else {
        // Deflationary prices: selling resources is very unfavorable vs using for expansion
        const RESOURCE_SELL: Record<string, number> = {
          wood: 0.02, stone: 0.05, iron: 0.20, gold: 1.00,
          egg: 0.30, milk: 0.80, wool: 0.50, honey: 5.00,
        };
        price = RESOURCE_SELL[itemId] ?? 0;
      }
    }
  }

  if (price <= 0) return state;

  const inv = { ...state.inventory };
  inv[itemId] = current - qty;
  if (inv[itemId] <= 0) delete inv[itemId];

  return {
    ...state,
    coins: parseFloat((state.coins + price * qty).toFixed(4)),
    inventory: inv,
  };
}

/** Sell all of an item. */
export function sellAll(state: GameState, itemId: string): GameState {
  const qty = state.inventory[itemId] ?? 0;
  if (qty <= 0) return state;
  return sell(state, itemId, qty);
}

/** Craft a tool. Consumes resources + coins. */
export function craftTool(
  state: GameState,
  toolId: ToolId,
  qty: number,
): GameState {
  if (qty <= 0) return state;
  const tool = getToolDef(toolId);

  // Check all ingredients
  const inv = { ...state.inventory };
  let coins = state.coins;

  for (const [res, needed] of Object.entries(tool.cost)) {
    if (res === "coins") {
      if (coins < (needed ?? 0) * qty - 0.001) return state;
    } else {
      if ((inv[res] ?? 0) < (needed ?? 0) * qty) return state;
    }
  }

  // Consume
  for (const [res, needed] of Object.entries(tool.cost)) {
    if (res === "coins") {
      coins = parseFloat((coins - (needed ?? 0) * qty).toFixed(4));
    } else {
      inv[res] = (inv[res] ?? 0) - (needed ?? 0) * qty;
      if (inv[res]! <= 0) delete inv[res];
    }
  }

  // Add tools
  inv[toolId] = (inv[toolId] ?? 0) + qty;

  return { ...state, inventory: inv, coins };
}
