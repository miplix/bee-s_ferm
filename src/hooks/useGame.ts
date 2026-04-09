import { useState, useCallback, useEffect, useRef } from "react";
import { CROPS, getLevel, RECIPES, RESOURCE_NODES, EXPANSIONS } from "../data/crops";

export interface PlotState { cropId: string | null; plantedAt: number | null; }
export interface NodeState { type: string; lastHarvest: number; hitsLeft: number; }
export interface GameState {
  coins: number; xp: number;
  inventory: Record<string, number>;
  plots: PlotState[];
  nodes: NodeState[]; // resource nodes (trees, rocks, iron, gold)
  expansion: number; // current expansion level (0 = base)
}

const KEY = "nf_v4";
const load = (): GameState | null => { try { return JSON.parse(localStorage.getItem(KEY)!); } catch { return null; } };
const persist = (s: GameState) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

function newGame(): GameState {
  return {
    coins: 0.5, xp: 0,
    inventory: { sunflower_seed: 5, potato_seed: 3 },
    plots: Array.from({ length: 5 }, () => ({ cropId: null, plantedAt: null })),
    nodes: [
      { type: "tree", lastHarvest: 0, hitsLeft: -1 },
      { type: "tree", lastHarvest: 0, hitsLeft: -1 },
      { type: "tree", lastHarvest: 0, hitsLeft: -1 },
      { type: "rock", lastHarvest: 0, hitsLeft: 20 },
      { type: "rock", lastHarvest: 0, hitsLeft: 20 },
    ],
    expansion: 0,
  };
}

export function useGame() {
  const [g, setG] = useState<GameState>(() => load() || newGame());
  const t = useRef<any>(null);

  useEffect(() => { clearTimeout(t.current); t.current = setTimeout(() => persist(g), 300); return () => clearTimeout(t.current); }, [g]);
  useEffect(() => { const fn = () => persist(g); window.addEventListener("beforeunload", fn); return () => window.removeEventListener("beforeunload", fn); }, [g]);

  const level = getLevel(g.xp);
  const crops = CROPS.filter(c => c.level <= level);

  const buySeed = useCallback((cropId: string, qty: number) => {
    const c = CROPS.find(x => x.id === cropId); if (!c) return;
    setG(p => {
      if (p.coins < c.seedPrice * qty) return p;
      const inv = { ...p.inventory }; const k = `${cropId}_seed`;
      inv[k] = (inv[k] || 0) + qty;
      return { ...p, coins: +(p.coins - c.seedPrice * qty).toFixed(4), inventory: inv };
    });
  }, []);

  const plant = useCallback((idx: number, cropId: string) => {
    setG(p => {
      const k = `${cropId}_seed`;
      if ((p.inventory[k] || 0) < 1 || p.plots[idx]?.cropId) return p;
      const inv = { ...p.inventory }; inv[k]--; if (inv[k] <= 0) delete inv[k];
      const plots = [...p.plots]; plots[idx] = { cropId, plantedAt: Date.now() };
      return { ...p, inventory: inv, plots };
    });
  }, []);

  const harvest = useCallback((idx: number) => {
    setG(p => {
      const pl = p.plots[idx]; if (!pl?.cropId || !pl.plantedAt) return p;
      const c = CROPS.find(x => x.id === pl.cropId);
      if (!c || Date.now() - pl.plantedAt < c.growMs) return p;
      const inv = { ...p.inventory }; inv[c.id] = (inv[c.id] || 0) + c.harvest;
      const plots = [...p.plots]; plots[idx] = { cropId: null, plantedAt: null };
      return { ...p, inventory: inv, plots };
    });
  }, []);

  const sell = useCallback((itemId: string, qty: number) => {
    const c = CROPS.find(x => x.id === itemId); if (!c) return;
    setG(p => {
      if ((p.inventory[itemId] || 0) < qty) return p;
      const inv = { ...p.inventory }; inv[itemId] -= qty; if (inv[itemId] <= 0) delete inv[itemId];
      return { ...p, coins: +(p.coins + c.sellPrice * qty).toFixed(4), inventory: inv };
    });
  }, []);

  const cook = useCallback((recipeId: string) => {
    const r = RECIPES.find(x => x.id === recipeId); if (!r) return;
    setG(p => {
      const inv = { ...p.inventory };
      for (const i of r.ingredients) if ((inv[i.id] || 0) < i.n) return p;
      for (const i of r.ingredients) { inv[i.id] -= i.n; if (inv[i.id] <= 0) delete inv[i.id]; }
      return { ...p, inventory: inv, xp: p.xp + r.xp };
    });
  }, []);

  const harvestNode = useCallback((idx: number) => {
    setG(p => {
      const node = p.nodes[idx]; if (!node) return p;
      const def = RESOURCE_NODES[node.type]; if (!def) return p;
      const now = Date.now();
      if (node.lastHarvest && now - node.lastHarvest < def.cooldownMs) return p;
      const inv = { ...p.inventory }; inv[def.resource] = (inv[def.resource] || 0) + def.amount;
      const nodes = [...p.nodes]; nodes[idx] = { ...node, lastHarvest: now, hitsLeft: node.hitsLeft > 0 ? node.hitsLeft - 1 : node.hitsLeft };
      return { ...p, inventory: inv, nodes };
    });
  }, []);

  const expand = useCallback(() => {
    setG(p => {
      const nextExp = EXPANSIONS[p.expansion];
      if (!nextExp || getLevel(p.xp) < nextExp.minLevel) return p;
      const inv = { ...p.inventory }; let coins = p.coins;
      for (const [res, amt] of Object.entries(nextExp.cost)) {
        if (res === "coins") { if (coins < amt) return p; coins = +(coins - amt).toFixed(4); }
        else { if ((inv[res] || 0) < amt) return p; inv[res] -= amt; if (inv[res] <= 0) delete inv[res]; }
      }
      const plots = [...p.plots, ...Array.from({ length: nextExp.adds.plots }, () => ({ cropId: null, plantedAt: null } as PlotState))];
      const nodes = [...p.nodes];
      for (let i = 0; i < nextExp.adds.trees; i++) nodes.push({ type: "tree", lastHarvest: 0, hitsLeft: -1 });
      for (let i = 0; i < nextExp.adds.rocks; i++) nodes.push({ type: "rock", lastHarvest: 0, hitsLeft: 20 });
      for (let i = 0; i < nextExp.adds.iron; i++) nodes.push({ type: "iron", lastHarvest: 0, hitsLeft: 10 });
      for (let i = 0; i < nextExp.adds.gold; i++) nodes.push({ type: "gold", lastHarvest: 0, hitsLeft: 5 });
      return { ...p, coins, inventory: inv, plots, nodes, expansion: p.expansion + 1 };
    });
  }, []);

  return { g, level, crops, buySeed, plant, harvest, sell, cook, harvestNode, expand };
}
