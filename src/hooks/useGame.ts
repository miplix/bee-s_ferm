import { useState, useCallback, useEffect, useRef } from "react";
import { CROPS, getLevel, RECIPES } from "../data/crops";

export interface PlotState { cropId: string | null; plantedAt: number | null; }
export interface GameState {
  coins: number; xp: number;
  inventory: Record<string, number>;
  plots: PlotState[]; // 5 starting plots, expandable
}

const SAVE_KEY = "nf_game_v3";
const load = (): GameState | null => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)!); } catch { return null; } };
const save = (s: GameState) => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch {} };

function newGame(): GameState {
  return {
    coins: 0.5, xp: 0,
    inventory: { sunflower_seed: 5, potato_seed: 3 },
    plots: Array.from({ length: 5 }, () => ({ cropId: null, plantedAt: null })),
  };
}

export function useGame() {
  const [g, setG] = useState<GameState>(() => load() || newGame());
  const t = useRef<any>(null);

  useEffect(() => { clearTimeout(t.current); t.current = setTimeout(() => save(g), 300); return () => clearTimeout(t.current); }, [g]);
  useEffect(() => { const fn = () => save(g); window.addEventListener("beforeunload", fn); return () => window.removeEventListener("beforeunload", fn); }, [g]);

  const level = getLevel(g.xp);
  const crops = CROPS.filter(c => c.level <= level);

  const buySeed = useCallback((cropId: string, qty: number) => {
    const c = CROPS.find(x => x.id === cropId);
    if (!c) return;
    setG(p => {
      if (p.coins < c.seedPrice * qty) return p;
      const inv = { ...p.inventory };
      inv[`${cropId}_seed`] = (inv[`${cropId}_seed`] || 0) + qty;
      return { ...p, coins: +(p.coins - c.seedPrice * qty).toFixed(4), inventory: inv };
    });
  }, []);

  const plant = useCallback((plotIdx: number, cropId: string) => {
    setG(p => {
      const k = `${cropId}_seed`;
      if ((p.inventory[k] || 0) < 1) return p;
      if (p.plots[plotIdx]?.cropId) return p;
      const inv = { ...p.inventory }; inv[k]--; if (inv[k] <= 0) delete inv[k];
      const plots = [...p.plots]; plots[plotIdx] = { cropId, plantedAt: Date.now() };
      return { ...p, inventory: inv, plots };
    });
  }, []);

  const harvest = useCallback((plotIdx: number) => {
    setG(p => {
      const pl = p.plots[plotIdx];
      if (!pl?.cropId || !pl.plantedAt) return p;
      const c = CROPS.find(x => x.id === pl.cropId);
      if (!c || Date.now() - pl.plantedAt < c.growMs) return p;
      const inv = { ...p.inventory }; inv[c.id] = (inv[c.id] || 0) + c.harvest;
      const plots = [...p.plots]; plots[plotIdx] = { cropId: null, plantedAt: null };
      return { ...p, inventory: inv, plots };
    });
  }, []);

  const sell = useCallback((itemId: string, qty: number) => {
    const c = CROPS.find(x => x.id === itemId);
    if (!c) return;
    setG(p => {
      if ((p.inventory[itemId] || 0) < qty) return p;
      const inv = { ...p.inventory }; inv[itemId] -= qty; if (inv[itemId] <= 0) delete inv[itemId];
      return { ...p, coins: +(p.coins + c.sellPrice * qty).toFixed(4), inventory: inv };
    });
  }, []);

  const cook = useCallback((recipeId: string) => {
    const r = RECIPES.find(x => x.id === recipeId);
    if (!r) return;
    setG(p => {
      const inv = { ...p.inventory };
      for (const ing of r.ingredients) { if ((inv[ing.id] || 0) < ing.n) return p; }
      for (const ing of r.ingredients) { inv[ing.id] -= ing.n; if (inv[ing.id] <= 0) delete inv[ing.id]; }
      return { ...p, inventory: inv, xp: p.xp + r.xp };
    });
  }, []);

  return { g, level, crops, buySeed, plant, harvest, sell, cook };
}
