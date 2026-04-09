import { useState, useEffect, type ReactNode } from "react";
import { useGame, type Cell } from "./hooks/useGame";
import { CROPS, RECIPES, LEVELS, getLevel, RESOURCE_NODES, EXPANSIONS, TOOLS, BUILDINGS, CHICKEN_LEVELS, COW_LEVELS, BEEHIVE_ACTION_INTERVAL, BEEHIVE_ACTIONS_TO_UPGRADE, BEEHIVE_DAILY_POLLEN, maxBeehiveSlots, ITEM_SELL, getShopStock } from "./data/crops";

const CS = 52;
function fmt(ms: number) { if (ms <= 0) return "✅"; const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60); return h > 0 ? `${h}:${String(m % 60).padStart(2, "0")}` : m > 0 ? `${m}:${String(s % 60).padStart(2, "0")}` : `${s}`; }
const EM: Record<string, string> = { wood: "🪵", stone: "🪨", iron: "⛏️", gold: "🪙", egg: "🥚", milk: "🥛", honey: "🍯", pollen: "🌸", axe: "🪓", stone_pickaxe: "⛏️", iron_pickaxe: "⛏️", gold_pickaxe: "⛏️" };
function ie(id: string) { return CROPS.find(c => c.id === id)?.emoji || (id.endsWith("_seed") ? (CROPS.find(c => c.id === id.replace("_seed", ""))?.emoji || "🌱") : EM[id] || TOOLS.find(t => t.id === id)?.emoji || "📦"); }
function iName(id: string) { const c = CROPS.find(c => c.id === id); if (c) return c.name; const s = id.endsWith("_seed") ? CROPS.find(c => c.id === id.replace("_seed", "")) : null; if (s) return `${s.name} сем.`; return { wood: "Дерево", stone: "Камень", iron: "Железо", gold: "Золото", egg: "Яйцо", milk: "Молоко", honey: "Мёд", pollen: "Пыльца", axe: "Топор", stone_pickaxe: "Кам.кирка", iron_pickaxe: "Жел.кирка", gold_pickaxe: "Зол.кирка" }[id] || id; }

function Panel({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3" onClick={onClose}>
    <div className="bg-[#3e2210] border-4 border-[#6b4226] rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#6b4226] bg-[#5a3210]">
        <h2 className="text-sm text-amber-200 font-bold">{title}</h2>
        <button onClick={onClose} className="text-amber-400 hover:text-white text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">{children}</div>
    </div>
  </div>);
}
function Btn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="bg-green-700 hover:bg-green-600 disabled:opacity-30 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold shrink-0">{children}</button>;
}
function Row({ emoji, title, sub, children }: { emoji: string; title: string; sub?: string; children?: ReactNode }) {
  return (<div className="flex items-center gap-2 bg-[#5a3210]/40 rounded-lg p-2">
    <span className="text-xl shrink-0">{emoji}</span>
    <div className="flex-1 min-w-0"><div className="text-[11px] text-amber-100">{title}</div>{sub && <div className="text-[9px] text-gray-400">{sub}</div>}</div>
    <div className="flex items-center gap-1 shrink-0">{children}</div>
  </div>);
}

type PanelId = "shop" | "inv" | "cook" | "craft" | "build" | "animals" | "beehive" | "expand" | null;

export default function App() {
  const G = useGame();
  const { g, level, crops } = G;
  const [panel, setPanel] = useState<PanelId>(null);
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(i); }, []);

  const curLvl = LEVELS.find(l => l.level === level); const nextLvl = LEVELS.find(l => l.level === level + 1);
  const xpCur = g.xp - (curLvl?.xp || 0); const xpNeed = Math.max(1, (nextLvl?.xp || g.xp + 1) - (curLvl?.xp || 0));

  // Cell click handler
  const cellClick = (x: number, y: number) => {
    const cell = g.grid[y]?.[x]; if (!cell) return;
    if (cell.type === "plot") {
      if (cell.cropId && cell.plantedAt) {
        const c = CROPS.find(cr => cr.id === cell.cropId);
        if (c && Date.now() - cell.plantedAt >= c.growMs) { G.harvest(x, y); return; }
      }
      // Auto-plant with selected seed
      if (!cell.cropId && g.selectedTool?.endsWith("_seed")) { G.plant(x, y); return; }
    }
    if (["tree", "rock", "iron", "gold"].includes(cell.type)) G.harvestNode(x, y);
    if (cell.type === "beehive" && cell.beehiveIdx !== undefined) G.beehiveAction(cell.beehiveIdx);
  };

  // Render cell — NO TEXT on map, only icons and highlights
  const renderCell = (cell: Cell | null, x: number, y: number) => {
    if (!cell) return <div key={`${x}-${y}`} style={{ width: CS, height: CS }} />;

    if (cell.type === "empty") return (
      <div key={`${x}-${y}`} style={{ width: CS, height: CS, background: (x + y) % 2 === 0 ? "#4a8c3f" : "#438536" }} />
    );

    if (cell.type === "plot") {
      const crop = cell.cropId ? CROPS.find(c => c.id === cell.cropId) : null;
      const elapsed = cell.plantedAt ? Date.now() - cell.plantedAt : 0;
      const ready = crop ? elapsed >= crop.growMs : false;
      const progress = crop ? Math.min(1, elapsed / crop.growMs) : 0;
      return (
        <div key={`${x}-${y}`} onClick={() => cellClick(x, y)}
          className="relative flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          style={{ width: CS, height: CS, background: "#6b4226", border: ready ? "2px solid #ffd700" : "1px solid #4a2f1a", boxShadow: ready ? "0 0 8px #ffd700" : "inset 0 1px 3px rgba(0,0,0,0.3)", borderRadius: 3 }}>
          {crop ? (
            <>
              <span style={{ fontSize: CS * 0.5 }}>{crop.emoji}</span>
              {!ready && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 rounded-b"><div className="h-full bg-green-400 rounded-b transition-all" style={{ width: `${progress * 100}%` }} /></div>}
            </>
          ) : (
            <span style={{ fontSize: CS * 0.35, opacity: 0.15 }}>🌱</span>
          )}
        </div>
      );
    }

    if (["tree", "rock", "iron", "gold"].includes(cell.type)) {
      const def = RESOURCE_NODES[cell.type]; if (!def) return null;
      const cd = cell.lastHarvest ? def.cooldownMs - (Date.now() - cell.lastHarvest) : 0;
      const ok = cd <= 0;
      const tool = TOOLS.find(t => t.forResource === cell.type);
      const hasTool = !tool || (g.inventory[tool.id] || 0) > 0;
      return (
        <div key={`${x}-${y}`} onClick={() => cellClick(x, y)}
          className={`relative flex items-center justify-center cursor-pointer transition-all ${ok && hasTool ? "hover:scale-105" : "opacity-35"}`}
          style={{ width: CS, height: CS, background: "#2d5a1e", border: "1px solid #1d4a10", borderRadius: 3 }}>
          <span style={{ fontSize: CS * 0.5 }}>{def.emoji}</span>
          {cd > 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 rounded-b"><div className="h-full bg-yellow-400 rounded-b" style={{ width: `${Math.max(0, 1 - cd / def.cooldownMs) * 100}%` }} /></div>}
          {!hasTool && ok && <span className="absolute top-0 right-0 text-[10px]">🔒</span>}
        </div>
      );
    }

    if (cell.type === "building") {
      const b = BUILDINGS.find(x => x.id === cell.buildingId);
      return (
        <div key={`${x}-${y}`} className="flex items-center justify-center" style={{ width: CS, height: CS, background: "#5a3210", border: "1px solid #3e2210", borderRadius: 3 }}>
          <span style={{ fontSize: CS * 0.5 }}>{b?.emoji || "🏠"}</span>
        </div>
      );
    }

    if (cell.type === "beehive") {
      const h = g.beehives[cell.beehiveIdx || 0];
      const cd = h?.lastAction ? BEEHIVE_ACTION_INTERVAL - (Date.now() - h.lastAction) : 0;
      const ok = cd <= 0;
      return (
        <div key={`${x}-${y}`} onClick={() => cellClick(x, y)}
          className={`relative flex items-center justify-center cursor-pointer transition-all ${ok ? "hover:scale-105" : "opacity-40"}`}
          style={{ width: CS, height: CS, background: "#8B6914", border: "1px solid #6b5210", borderRadius: 3 }}>
          <span style={{ fontSize: CS * 0.5 }}>🐝</span>
          {cd > 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 rounded-b"><div className="h-full bg-yellow-400 rounded-b" style={{ width: `${Math.max(0, 1 - cd / BEEHIVE_ACTION_INTERVAL) * 100}%` }} /></div>}
        </div>
      );
    }

    return <div key={`${x}-${y}`} style={{ width: CS, height: CS, background: "#4a8c3f" }} />;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "linear-gradient(180deg,#87CEEB 0%,#5da33a 40%,#3d7a25 100%)" }}>
      {/* HUD */}
      <header className="shrink-0 flex items-center justify-between px-2 py-1 bg-[#3e2210]/90 border-b-2 border-[#6b4226] z-20">
        <div className="flex items-center gap-1">
          <div className="bg-[#5a3210] rounded px-2 py-0.5 flex items-center gap-1 border border-[#6b4226] text-[10px]">
            ⭐{level} <div className="w-10 h-1 bg-[#3e2210] rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${(xpCur / xpNeed) * 100}%` }} /></div>
          </div>
          <div className="bg-[#5a3210] rounded px-2 py-0.5 flex items-center gap-1 border border-[#6b4226] text-[10px]">🪙{g.coins.toFixed(2)}</div>
          <div className="bg-[#5a3210] rounded px-2 py-0.5 flex items-center gap-1 border border-[#6b4226] text-[10px]">🌸{g.pollen.toFixed(1)}</div>
          <div className="bg-[#5a3210] rounded px-1.5 py-0.5 border border-[#6b4226] text-[9px] text-amber-200/50">{g.gridW}×{g.gridH}</div>
        </div>
        <div className="flex items-center gap-0.5">
          {([["shop","🏪"],["inv","📦"],["cook","🍳"],["craft","🔨"],["build","🏗️"],["animals","🐔"],["beehive","🐝"],["expand","🗺️"]] as [PanelId,string][]).map(([id,icon])=>(
            <button key={id!} onClick={()=>setPanel(panel===id?null:id)} className={`px-1.5 py-0.5 rounded text-base ${panel===id?"bg-amber-600":"bg-[#3e2210]/60 hover:bg-[#5a3210]"}`}>{icon}</button>
          ))}
        </div>
      </header>

      {/* QUICKBAR — right side */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
        {g.quickbar.filter(id => (g.inventory[id] || 0) > 0).slice(0, 3).map(id => (
          <div key={id} onClick={() => G.selectTool(id)}
            className={`relative w-11 h-11 rounded-lg flex items-center justify-center cursor-pointer border-2 transition-all ${g.selectedTool === id ? "border-yellow-400 bg-[#5a3210] shadow-lg shadow-yellow-400/30" : "border-[#6b4226]/50 bg-[#3e2210]/70 hover:bg-[#5a3210]"}`}>
            <span className="text-xl">{ie(id)}</span>
            <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">{g.inventory[id]}</span>
          </div>
        ))}
      </div>

      {/* MAP */}
      <main className="flex-1 overflow-auto p-2 flex items-start justify-center">
        <div className="inline-grid gap-px bg-[#2d6b35]/80 p-0.5 rounded-lg border-2 border-[#1d5a20]" style={{ gridTemplateColumns: `repeat(${g.gridW}, ${CS}px)` }}>
          {g.grid.map((row, y) => row.map((cell, x) => renderCell(cell, x, y)))}
        </div>
      </main>

      {/* === PANELS (these have text, map does NOT) === */}
      {panel === "shop" && <Panel title="🏪 Рынок" onClose={() => setPanel(null)}>
        <div className="text-[10px] text-amber-300 mb-1">🪙 {g.coins.toFixed(2)}</div>
        <div className="text-[8px] text-gray-500 mb-1 uppercase tracking-wider">Семена</div>
        {crops.map(c => { const sid = `${c.id}_seed`; const stock = getShopStock(sid, g.shopPurchases); return (
          <div key={c.id} className="flex items-center gap-1.5 bg-[#5a3210]/30 rounded p-1 mb-0.5">
            <span className="text-sm">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-amber-100">{c.name} <span className="text-gray-500">🪙{c.seedPrice}</span></div>
              <div className="text-[7px] text-gray-500">{fmt(c.growMs)}·×{c.harvest} | ост:{stock.available}</div>
            </div>
            <button onClick={() => { G.buySeed(c.id, 1); G.selectTool(sid); }} disabled={g.coins < c.seedPrice || stock.available < 1} className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-25 text-white px-1.5 py-0.5 rounded">×1</button>
            <button onClick={() => { G.buySeed(c.id, 10); G.selectTool(sid); }} disabled={g.coins < c.seedPrice * 10 || stock.available < 10} className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-25 text-white px-1.5 py-0.5 rounded">×10</button>
          </div>); })}
        <div className="text-[8px] text-gray-500 mb-1 mt-2 uppercase tracking-wider">Инструменты</div>
        {[{id:"axe",n:"Топор",e:"🪓",p:0.05},{id:"stone_pickaxe",n:"Кам.кирка",e:"⛏️",p:0.20},{id:"iron_pickaxe",n:"Жел.кирка",e:"⛏️",p:1.00},{id:"gold_pickaxe",n:"Зол.кирка",e:"⛏️",p:5.00}].map(t=>{ const stock = getShopStock(t.id, g.shopPurchases); return (
          <div key={t.id} className="flex items-center gap-1.5 bg-[#5a3210]/30 rounded p-1 mb-0.5">
            <span className="text-sm">{t.e}</span>
            <div className="flex-1"><div className="text-[9px] text-amber-100">{t.n} <span className="text-gray-500">🪙{t.p} ×{g.inventory[t.id]||0}</span></div><div className="text-[7px] text-gray-500">ост:{stock.available}</div></div>
            <button onClick={()=>G.buyTool(t.id,1)} disabled={g.coins<t.p||stock.available<1} className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-25 text-white px-1.5 py-0.5 rounded">×1</button>
            <button onClick={()=>G.buyTool(t.id,5)} disabled={g.coins<t.p*5||stock.available<5} className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-25 text-white px-1.5 py-0.5 rounded">×5</button>
          </div>); })}
      </Panel>}

      {panel === "inv" && <Panel title="📦 Инвентарь" onClose={() => setPanel(null)}>
        {Object.keys(g.inventory).length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Пусто</p> :
          <div className="space-y-1">{Object.entries(g.inventory).map(([id, count]) => {
            const price = CROPS.find(c => c.id === id)?.sellPrice || ITEM_SELL[id] || 0;
            return (<div key={id} onClick={() => G.selectTool(id)} className={`flex items-center gap-2 bg-[#5a3210]/40 rounded-lg p-1.5 cursor-pointer border ${g.selectedTool === id ? "border-yellow-400" : "border-transparent hover:border-[#6b4226]"}`}>
              <span className="text-lg">{ie(id)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-amber-100">{iName(id)}</div>
                <div className="text-[8px] text-gray-500">×{count}{price > 0 ? ` · 🪙${price}/шт` : ""}</div>
              </div>
              {price > 0 && <div className="flex gap-0.5 shrink-0">
                <button onClick={e => { e.stopPropagation(); G.sell(id, 1); }} disabled={count < 1} className="text-[7px] bg-amber-800 hover:bg-amber-700 disabled:opacity-25 text-white px-1 py-0.5 rounded">×1</button>
                <button onClick={e => { e.stopPropagation(); G.sell(id, Math.min(10, count)); }} disabled={count < 1} className="text-[7px] bg-amber-800 hover:bg-amber-700 disabled:opacity-25 text-white px-1 py-0.5 rounded">×10</button>
                <button onClick={e => { e.stopPropagation(); G.sell(id, Math.min(100, count)); }} disabled={count < 1} className="text-[7px] bg-amber-800 hover:bg-amber-700 disabled:opacity-25 text-white px-1 py-0.5 rounded">×100</button>
                <button onClick={e => { e.stopPropagation(); G.sellAll(id); }} disabled={count < 1} className="text-[7px] bg-red-800 hover:bg-red-700 disabled:opacity-25 text-white px-1 py-0.5 rounded">Всё</button>
              </div>}
            </div>);
          })}</div>}
      </Panel>}

      {panel === "cook" && <Panel title="🍳 Готовка → XP" onClose={() => setPanel(null)}>
        {RECIPES.filter(r => g.buildings.includes(r.building)).length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Постройте Костёр, Кухню или Пекарню</p> :
          RECIPES.filter(r => g.buildings.includes(r.building)).map(r => {
            const can = r.ingredients.every(i => (g.inventory[i.id] || 0) >= i.n);
            return <Row key={r.id} emoji={r.emoji} title={`${r.name} +${r.xp}XP`} sub={r.ingredients.map(i => `${ie(i.id)}×${i.n}`).join(" + ")}><Btn onClick={() => G.cook(r.id)} disabled={!can}>Готовить</Btn></Row>;
          })}
      </Panel>}

      {panel === "craft" && <Panel title="🔨 Крафт" onClose={() => setPanel(null)}>
        {TOOLS.map(tool => { const can = Object.entries(tool.cost).every(([r, a]) => (g.inventory[r] || 0) >= a);
          return <Row key={tool.id} emoji={tool.emoji} title={`${tool.name} (×${g.inventory[tool.id] || 0})`} sub={Object.entries(tool.cost).map(([r, a]) => `${iName(r)}×${a}`).join(" + ")}>
            <Btn onClick={() => G.craftTool(tool.id, 1)} disabled={!can}>×1</Btn><Btn onClick={() => G.craftTool(tool.id, 5)} disabled={!can}>×5</Btn></Row>; })}
      </Panel>}

      {panel === "build" && <Panel title="🏗️ Стройка" onClose={() => setPanel(null)}>
        {G.availBuildings.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Все построено</p> :
          G.availBuildings.map(b => { const can = Object.entries(b.cost).every(([r, a]) => r === "coins" ? g.coins >= a : (g.inventory[r] || 0) >= a);
            return <Row key={b.id} emoji={b.emoji} title={b.name} sub={`${b.desc} · ${Object.entries(b.cost).map(([r, a]) => `${r === "coins" ? "🪙" : iName(r)}×${a}`).join("+") || "Бесплатно"}`}>
              <Btn onClick={() => G.build(b.id)} disabled={!can}>Построить</Btn></Row>; })}
      </Panel>}

      {panel === "expand" && <Panel title="🗺️ Расширение" onClose={() => setPanel(null)}>
        <div className="text-[11px] text-amber-300 mb-2">{g.gridW}×{g.gridH} · Расш: {g.expansion}/{EXPANSIONS.length}</div>
        {(() => { const e = EXPANSIONS[g.expansion]; if (!e) return <p className="text-green-300 text-sm text-center py-4">✅ Всё!</p>;
          const can = level >= e.minLevel && Object.entries(e.cost).every(([r, a]) => r === "coins" ? g.coins >= a : (g.inventory[r] || 0) >= a);
          return <div className="bg-[#5a3210]/40 rounded-xl p-3 space-y-2">
            <div className="text-sm text-amber-100 font-bold">#{e.id} (ур.{e.minLevel}+)</div>
            <div className="text-xs text-amber-300">{Object.entries(e.cost).map(([r, a]) => `${r === "coins" ? "🪙" : iName(r)}×${a}`).join(", ")}</div>
            <div className="text-xs text-green-300">+{e.adds.plots}🌱 +{e.adds.trees}🌳 +{e.adds.rocks}🪨{e.adds.iron > 0 ? ` +${e.adds.iron}⛏️` : ""}{e.adds.gold > 0 ? ` +${e.adds.gold}✨` : ""}</div>
            <Btn onClick={() => { G.expand(); setPanel(null); }} disabled={!can}>{can ? "🔓 Расширить" : `🔒 Ур.${e.minLevel}`}</Btn>
          </div>; })()}
      </Panel>}

      {panel === "animals" && <Panel title="🐔 Животные" onClose={() => setPanel(null)}>
        {!g.buildings.includes("henhouse") && !g.buildings.includes("barn") ? <p className="text-gray-400 text-sm text-center py-4">Постройте Курятник или Хлев</p> : <>
          {g.buildings.includes("henhouse") && <>{g.animals.filter(a => a.type === "chicken").map(a => { const idx = g.animals.indexOf(a); let lvl = CHICKEN_LEVELS[0]; for (const l of CHICKEN_LEVELS) if (a.xp >= l.xpNeeded) lvl = l; const ready = a.lastFed && Date.now() - a.lastFed >= lvl.timeMs;
            return <Row key={idx} emoji="🐔" title={`Ур.${lvl.level}`} sub={a.lastFed && !ready ? fmt(lvl.timeMs - (Date.now() - a.lastFed)) : ready ? "🥚!" : `${lvl.feedCost}🌾`}>
              {!a.lastFed && <Btn onClick={() => G.feedAnimal(idx)} disabled={(g.inventory.wheat || 0) < lvl.feedCost}>🌾</Btn>}
              {ready && <Btn onClick={() => G.collectAnimal(idx)}>🥚</Btn>}</Row>; })}
            <Btn onClick={G.buyChicken} disabled={g.coins < 5 || g.animals.filter(a => a.type === "chicken").length >= 10}>+🐔 5🪙</Btn></>}
          {g.buildings.includes("barn") && <>{g.animals.filter(a => a.type === "cow").map(a => { const idx = g.animals.indexOf(a); let lvl = COW_LEVELS[0]; for (const l of COW_LEVELS) if (a.xp >= l.xpNeeded) lvl = l; const ready = a.lastFed && Date.now() - a.lastFed >= lvl.timeMs;
            return <Row key={idx} emoji="🐄" title={`Ур.${lvl.level}`} sub={a.lastFed && !ready ? fmt(lvl.timeMs - (Date.now() - a.lastFed)) : ready ? "🥛!" : "5🌾"}>
              {!a.lastFed && <Btn onClick={() => G.feedAnimal(idx)} disabled={(g.inventory.wheat || 0) < 5}>🌾</Btn>}
              {ready && <Btn onClick={() => G.collectAnimal(idx)}>🥛</Btn>}</Row>; })}
            <Btn onClick={G.buyCow} disabled={g.coins < 50 || g.animals.filter(a => a.type === "cow").length >= 10}>+🐄 50🪙</Btn></>}
        </>}</Panel>}

      {panel === "beehive" && <Panel title="🐝 Пчёлы" onClose={() => setPanel(null)}>
        <div className="text-[11px] text-amber-300 mb-2">🌸{g.pollen.toFixed(1)} · {g.beehives.length}/{maxBeehiveSlots(level)}</div>
        {g.beehives.map((h, i) => { const cd = h.lastAction ? BEEHIVE_ACTION_INTERVAL - (Date.now() - h.lastAction) : 0; const ok = cd <= 0; const pct = h.level === 0 ? (h.actions / BEEHIVE_ACTIONS_TO_UPGRADE) * 100 : 100;
          return <div key={i} className="bg-[#5a3210]/40 rounded-lg p-2">
            <div className="flex items-center gap-2"><span className="text-xl">🐝</span><div className="flex-1 text-[11px] text-amber-100">{h.level === 0 ? `Демо ${pct.toFixed(0)}%` : `Ур.${h.level}`}</div>
            {ok ? <Btn onClick={() => G.beehiveAction(i)}>🐝</Btn> : <span className="text-[10px] text-yellow-300">{fmt(cd)}</span>}</div>
            {h.level === 0 && <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mt-1"><div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} /></div>}
          </div>; })}
        {maxBeehiveSlots(level) > g.beehives.length && <Btn onClick={G.buyBeehive} disabled={g.pollen < 1000}>+🐝 1000🌸</Btn>}
      </Panel>}
    </div>
  );
}
