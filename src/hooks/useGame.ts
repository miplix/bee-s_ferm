import { useState, useCallback, useEffect, useRef } from "react";
import { CROPS, getLevel, RECIPES, RESOURCE_NODES, EXPANSIONS, TOOLS, BUILDINGS, CHICKEN_LEVELS, COW_LEVELS, BEEHIVE_DEMO_DAILY, BEEHIVE_DAILY_POLLEN, BEEHIVE_ACTION_INTERVAL, BEEHIVE_ACTIONS_TO_UPGRADE, maxBeehiveSlots, ITEM_SELL, getShopStock } from "../data/crops";

export type CellType = "empty" | "plot" | "tree" | "rock" | "iron" | "gold" | "building" | "beehive";
export interface Cell { type: CellType; cropId?: string | null; plantedAt?: number | null; lastHarvest?: number; hitsLeft?: number; buildingId?: string; beehiveIdx?: number; }
export interface AnimalState { type: "chicken" | "cow"; xp: number; lastFed: number; lastCollect: number; }
export interface BeehiveState { level: number; actions: number; lastAction: number; }
export interface ShopRecord { weekly: number; daily: number; lastDay: string; lastWeek: string; }
export interface GameState {
  coins: number; xp: number; pollen: number; inventory: Record<string, number>;
  gridW: number; gridH: number; grid: (Cell | null)[][];
  buildings: string[]; animals: AnimalState[]; beehives: BeehiveState[]; expansion: number;
  quickbar: string[]; selectedTool: string | null;
  shopPurchases: Record<string, ShopRecord>;
}

const KEY = "nf_v7";
function getWeekStartStr(): string { const d = new Date(); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); return new Date(d.setDate(diff)).toISOString().slice(0, 10); }
const load = (): GameState | null => { try { return JSON.parse(localStorage.getItem(KEY)!); } catch { return null; } };
const persist = (s: GameState) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

function newGame(): GameState {
  const w = 6, h = 6;
  // Start with null everywhere, then carve out the center 6x6
  const grid: (Cell | null)[][] = Array.from({ length: h }, () => Array.from({ length: w }, (): Cell => ({ type: "empty" })));
  // Plots 3x2 center
  [[1,2],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[4,3]].forEach(([x,y]) => { grid[y][x] = { type: "plot", cropId: null, plantedAt: null }; });
  // Trees
  grid[0][0] = { type: "tree", lastHarvest: 0, hitsLeft: -1 };
  grid[0][5] = { type: "tree", lastHarvest: 0, hitsLeft: -1 };
  grid[5][0] = { type: "tree", lastHarvest: 0, hitsLeft: -1 };
  // Rocks
  grid[5][5] = { type: "rock", lastHarvest: 0, hitsLeft: 20 };
  grid[4][5] = { type: "rock", lastHarvest: 0, hitsLeft: 20 };
  // Buildings
  grid[0][2] = { type: "building", buildingId: "workbench" };
  grid[0][3] = { type: "building", buildingId: "market" };
  // Beehive
  grid[5][2] = { type: "beehive", beehiveIdx: 0 };

  return {
    coins: 0.5, xp: 0, pollen: 0,
    inventory: { sunflower_seed: 5, potato_seed: 3, axe: 3 },
    gridW: w, gridH: h, grid,
    buildings: ["workbench", "market"], animals: [],
    beehives: [{ level: 0, actions: 0, lastAction: 0 }],
    expansion: 0, quickbar: [], selectedTool: null, shopPurchases: {},
  };
}

export function useGame() {
  const [g, setG] = useState<GameState>(() => load() || newGame());
  const t = useRef<any>(null);
  useEffect(() => { clearTimeout(t.current); t.current = setTimeout(() => persist(g), 300); return () => clearTimeout(t.current); }, [g]);
  useEffect(() => { const fn = () => persist(g); window.addEventListener("beforeunload", fn); return () => window.removeEventListener("beforeunload", fn); }, [g]);

  const level = getLevel(g.xp);
  const crops = CROPS.filter(c => c.level <= level);
  const availBuildings = BUILDINGS.filter(b => b.level <= level && !g.buildings.includes(b.id));

  const selectTool = useCallback((toolId: string) => {
    setG(p => {
      const qb = [toolId, ...p.quickbar.filter(t => t !== toolId)].slice(0, 3);
      return { ...p, selectedTool: toolId, quickbar: qb };
    });
  }, []);

  // Sell multiple or all
  const sell = useCallback((itemId: string, qty: number) => { setG(p => { if ((p.inventory[itemId] || 0) < qty) return p; const price = CROPS.find(c => c.id === itemId)?.sellPrice || ITEM_SELL[itemId] || 0; if (!price) return p; const inv = { ...p.inventory }; inv[itemId] -= qty; if (inv[itemId] <= 0) delete inv[itemId]; return { ...p, coins: +(p.coins + price * qty).toFixed(4), inventory: inv }; }); }, []);
  const sellAll = useCallback((itemId: string) => { const qty = g.inventory[itemId] || 0; if (qty > 0) sell(itemId, qty); }, [g.inventory, sell]);

  const buySeed = useCallback((cropId: string, qty: number) => { const c = CROPS.find(x => x.id === cropId); if (!c) return; setG(p => {
    if (p.coins < c.seedPrice * qty) return p;
    const seedId = `${cropId}_seed`;
    const stock = getShopStock(seedId, p.shopPurchases);
    const actual = Math.min(qty, stock.available); if (actual <= 0) return p;
    const inv = { ...p.inventory }; inv[seedId] = (inv[seedId] || 0) + actual;
    const today = new Date().toISOString().slice(0, 10);
    const ws = getWeekStartStr();
    const rec = p.shopPurchases[seedId] || { weekly: 0, daily: 0, lastDay: "", lastWeek: "" };
    const sp = { ...p.shopPurchases, [seedId]: { weekly: (rec.lastWeek === ws ? rec.weekly : 0) + actual, daily: (rec.lastDay === today ? rec.daily : 0) + actual, lastDay: today, lastWeek: ws } };
    return { ...p, coins: +(p.coins - c.seedPrice * actual).toFixed(4), inventory: inv, shopPurchases: sp };
  }); }, []);

  // Plant: uses selectedTool if it's a seed
  const plant = useCallback((x: number, y: number) => {
    setG(p => {
      const cell = p.grid[y]?.[x]; if (!cell || cell.type !== "plot" || cell.cropId) return p;
      // Find seed from selectedTool
      const seedId = p.selectedTool; if (!seedId || !seedId.endsWith("_seed")) return p;
      if ((p.inventory[seedId] || 0) < 1) return p;
      const inv = { ...p.inventory }; inv[seedId]--; if (inv[seedId] <= 0) delete inv[seedId];
      const grid = p.grid.map(r => r.map(c => c ? { ...c } : null));
      grid[y][x] = { ...cell, cropId: seedId.replace("_seed", ""), plantedAt: Date.now() };
      return { ...p, inventory: inv, grid };
    });
  }, []);

  const harvest = useCallback((x: number, y: number) => { setG(p => { const cell = p.grid[y]?.[x]; if (!cell || cell.type !== "plot" || !cell.cropId || !cell.plantedAt) return p; const c = CROPS.find(cr => cr.id === cell.cropId); if (!c || Date.now() - cell.plantedAt! < c.growMs) return p; const inv = { ...p.inventory }; inv[c.id] = (inv[c.id] || 0) + c.harvest; const grid = p.grid.map(r => r.map(c => c ? { ...c } : null)); grid[y][x] = { type: "plot", cropId: null, plantedAt: null }; return { ...p, inventory: inv, grid }; }); }, []);

  const cook = useCallback((recipeId: string) => { const r = RECIPES.find(x => x.id === recipeId); if (!r) return; setG(p => { if (!p.buildings.includes(r.building)) return p; const inv = { ...p.inventory }; for (const i of r.ingredients) if ((inv[i.id] || 0) < i.n) return p; for (const i of r.ingredients) { inv[i.id] -= i.n; if (inv[i.id] <= 0) delete inv[i.id]; } return { ...p, inventory: inv, xp: p.xp + r.xp }; }); }, []);

  const harvestNode = useCallback((x: number, y: number) => { setG(p => { const cell = p.grid[y]?.[x]; if (!cell || !["tree", "rock", "iron", "gold"].includes(cell.type)) return p; const def = RESOURCE_NODES[cell.type]; if (!def) return p; if (cell.lastHarvest && Date.now() - cell.lastHarvest < def.cooldownMs) return p; const tool = TOOLS.find(t => t.forResource === cell.type); if (tool && (p.inventory[tool.id] || 0) < 1) return p; const inv = { ...p.inventory }; inv[def.resource] = (inv[def.resource] || 0) + def.amount; if (tool) { inv[tool.id]--; if (inv[tool.id] <= 0) delete inv[tool.id]; } const grid = p.grid.map(r => r.map(c => c ? { ...c } : null)); grid[y][x] = { ...cell, lastHarvest: Date.now() }; return { ...p, inventory: inv, grid }; }); }, []);

  const craftTool = useCallback((toolId: string, qty: number) => { const tool = TOOLS.find(t => t.id === toolId); if (!tool) return; setG(p => { const inv = { ...p.inventory }; for (const [r, a] of Object.entries(tool.cost)) if ((inv[r] || 0) < a * qty) return p; for (const [r, a] of Object.entries(tool.cost)) { inv[r] -= a * qty; if (inv[r] <= 0) delete inv[r]; } inv[tool.id] = (inv[tool.id] || 0) + qty; return { ...p, inventory: inv }; }); }, []);
  const buyTool = useCallback((toolId: string, qty: number) => {
    const prices: Record<string, number> = { axe: 0.05, stone_pickaxe: 0.20, iron_pickaxe: 1.00, gold_pickaxe: 5.00 };
    const price = prices[toolId]; if (!price) return;
    setG(p => {
      if (p.coins < price * qty) return p;
      const stock = getShopStock(toolId, p.shopPurchases);
      const actual = Math.min(qty, stock.available); if (actual <= 0) return p;
      const inv = { ...p.inventory }; inv[toolId] = (inv[toolId] || 0) + actual;
      const today = new Date().toISOString().slice(0, 10); const ws = getWeekStartStr();
      const rec = p.shopPurchases[toolId] || { weekly: 0, daily: 0, lastDay: "", lastWeek: "" };
      const sp = { ...p.shopPurchases, [toolId]: { weekly: (rec.lastWeek === ws ? rec.weekly : 0) + actual, daily: (rec.lastDay === today ? rec.daily : 0) + actual, lastDay: today, lastWeek: ws } };
      return { ...p, coins: +(p.coins - price * actual).toFixed(4), inventory: inv, shopPurchases: sp };
    });
  }, []);

  const build = useCallback((buildingId: string) => { const b = BUILDINGS.find(x => x.id === buildingId); if (!b) return; setG(p => { if (p.buildings.includes(buildingId)) return p; const inv = { ...p.inventory }; let coins = p.coins; for (const [r, a] of Object.entries(b.cost)) { if (r === "coins") { if (coins < a) return p; coins = +(coins - a).toFixed(4); } else { if ((inv[r] || 0) < a) return p; inv[r] -= a; if (inv[r] <= 0) delete inv[r]; } } const grid = p.grid.map(r => r.map(c => c ? { ...c } : null)); for (let y = 0; y < grid.length; y++) for (let x = 0; x < grid[0].length; x++) if (grid[y][x]?.type === "empty") { grid[y][x] = { type: "building", buildingId }; return { ...p, coins, inventory: inv, buildings: [...p.buildings, buildingId], grid }; } return { ...p, coins, inventory: inv, buildings: [...p.buildings, buildingId] }; }); }, []);

  // Expand: add 3x3 block around edges
  const expand = useCallback(() => { setG(p => {
    const e = EXPANSIONS[p.expansion]; if (!e || getLevel(p.xp) < e.minLevel) return p;
    const inv = { ...p.inventory }; let coins = p.coins;
    for (const [r, a] of Object.entries(e.cost)) { if (r === "coins") { if (coins < a) return p; coins = +(coins - a).toFixed(4); } else { if ((inv[r] || 0) < a) return p; inv[r] -= a; if (inv[r] <= 0) delete inv[r]; } }
    // Expand grid by 3 in each direction (add ring of 3 cells)
    const newW = p.gridW + 3, newH = p.gridH + 3;
    const offX = 1, offY = 1; // offset old grid by 1 to center it
    const grid: (Cell | null)[][] = Array.from({ length: newH }, (_, y) =>
      Array.from({ length: newW }, (_, x) => {
        const oy = y - offY, ox = x - offX;
        if (oy >= 0 && oy < p.gridH && ox >= 0 && ox < p.gridW) return p.grid[oy][ox] ? { ...p.grid[oy][ox]! } : null;
        return { type: "empty" as CellType };
      })
    );
    const placeIn = (type: CellType, extra: Partial<Cell> = {}) => { for (let y = 0; y < newH; y++) for (let x = 0; x < newW; x++) if (grid[y][x]?.type === "empty") { grid[y][x] = { type, ...extra }; return; } };
    for (let i = 0; i < e.adds.plots; i++) placeIn("plot", { cropId: null, plantedAt: null });
    for (let i = 0; i < e.adds.trees; i++) placeIn("tree", { lastHarvest: 0, hitsLeft: -1 });
    for (let i = 0; i < e.adds.rocks; i++) placeIn("rock", { lastHarvest: 0, hitsLeft: 20 });
    for (let i = 0; i < e.adds.iron; i++) placeIn("iron", { lastHarvest: 0, hitsLeft: 10 });
    for (let i = 0; i < e.adds.gold; i++) placeIn("gold", { lastHarvest: 0, hitsLeft: 5 });
    return { ...p, coins, inventory: inv, grid, gridW: newW, gridH: newH, expansion: p.expansion + 1 };
  }); }, []);

  const buyChicken = useCallback(() => { setG(p => { if (!p.buildings.includes("henhouse") || p.animals.filter(a => a.type === "chicken").length >= 10 || p.coins < 5) return p; return { ...p, coins: +(p.coins - 5).toFixed(4), animals: [...p.animals, { type: "chicken", xp: 0, lastFed: 0, lastCollect: 0 }] }; }); }, []);
  const buyCow = useCallback(() => { setG(p => { if (!p.buildings.includes("barn") || p.animals.filter(a => a.type === "cow").length >= 10 || p.coins < 50) return p; return { ...p, coins: +(p.coins - 50).toFixed(4), animals: [...p.animals, { type: "cow", xp: 0, lastFed: 0, lastCollect: 0 }] }; }); }, []);
  const feedAnimal = useCallback((idx: number) => { setG(p => { const a = p.animals[idx]; if (!a) return p; const inv = { ...p.inventory }; const cost = a.type === "chicken" ? (CHICKEN_LEVELS.find(l => a.xp >= l.xpNeeded) || CHICKEN_LEVELS[0]).feedCost : 5; if ((inv.wheat || 0) < cost) return p; inv.wheat -= cost; if (inv.wheat <= 0) delete inv.wheat; const animals = [...p.animals]; animals[idx] = { ...a, lastFed: Date.now(), xp: a.xp + 10 }; return { ...p, inventory: inv, animals }; }); }, []);
  const collectAnimal = useCallback((idx: number) => { setG(p => { const a = p.animals[idx]; if (!a || !a.lastFed) return p; const levels = a.type === "chicken" ? CHICKEN_LEVELS : COW_LEVELS; let lvl = levels[0]; for (const l of levels) if (a.xp >= l.xpNeeded) lvl = l; if (Date.now() - a.lastFed < lvl.timeMs) return p; const inv = { ...p.inventory }; inv[lvl.product] = (inv[lvl.product] || 0) + lvl.amount; const animals = [...p.animals]; animals[idx] = { ...a, lastCollect: Date.now(), lastFed: 0 }; return { ...p, inventory: inv, animals }; }); }, []);
  const beehiveAction = useCallback((idx: number) => { setG(p => { const h = p.beehives[idx]; if (!h) return p; const now = Date.now(); if (h.lastAction && now - h.lastAction < BEEHIVE_ACTION_INTERVAL) return p; const beehives = [...p.beehives]; const na = h.actions + 1; let pollen = p.pollen + (h.level === 0 ? BEEHIVE_DEMO_DAILY / 3 : BEEHIVE_DAILY_POLLEN / 3); if (h.level === 0 && na >= BEEHIVE_ACTIONS_TO_UPGRADE) beehives[idx] = { level: 1, actions: 0, lastAction: now }; else beehives[idx] = { ...h, actions: na, lastAction: now }; return { ...p, beehives, pollen: +pollen.toFixed(4) }; }); }, []);
  const buyBeehive = useCallback(() => { setG(p => { if (p.beehives.length >= maxBeehiveSlots(getLevel(p.xp)) || p.pollen < 1000) return p; return { ...p, pollen: +(p.pollen - 1000).toFixed(4), beehives: [...p.beehives, { level: 1, actions: 0, lastAction: 0 }] }; }); }, []);

  return { g, level, crops, availBuildings, selectTool, buySeed, plant, harvest, sell, sellAll, cook, harvestNode, craftTool, buyTool, build, expand, buyChicken, buyCow, feedAnimal, collectAnimal, beehiveAction, buyBeehive };
}
