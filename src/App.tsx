import { useState, useEffect, type ReactNode } from "react";
import { useGame, type Cell } from "./hooks/useGame";
import { CROPS, RECIPES, LEVELS, getLevel, RESOURCE_NODES, EXPANSIONS, TOOLS, BUILDINGS, CHICKEN_LEVELS, COW_LEVELS, BEEHIVE_ACTION_INTERVAL, BEEHIVE_ACTIONS_TO_UPGRADE, BEEHIVE_DAILY_POLLEN, maxBeehiveSlots, ITEM_SELL } from "./data/crops";

const CS = 56; // cell size px

function fmt(ms: number) {
  if (ms <= 0) return "✅";
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  if (h > 0) return `${h}ч${m % 60}м`;
  if (m > 0) return `${m}м${s % 60}с`;
  return `${s}с`;
}

const EMOJI: Record<string, string> = { wood: "🪵", stone: "🪨", iron: "⛏️", gold: "🪙", egg: "🥚", milk: "🥛", honey: "🍯", pollen: "🌸" };
function iEmoji(id: string) { return CROPS.find(c => c.id === id)?.emoji || (id.endsWith("_seed") ? "🌱" : TOOLS.find(t => t.id === id)?.emoji || EMOJI[id] || "📦"); }
function iName(id: string) { const c = CROPS.find(c => c.id === id); if (c) return c.name; const s = id.endsWith("_seed") ? CROPS.find(c => c.id === id.replace("_seed", "")) : null; if (s) return `${s.name} сем.`; return TOOLS.find(t => t.id === id)?.name || { wood: "Дерево", stone: "Камень", iron: "Железо", gold: "Золото", egg: "Яйцо", milk: "Молоко", honey: "Мёд", pollen: "Пыльца" }[id] || id; }
function iPrice(id: string) { return CROPS.find(c => c.id === id)?.sellPrice || ITEM_SELL[id] || 0; }

function Panel({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3" onClick={onClose}>
    <div className="bg-[#3e2210] border-4 border-[#6b4226] rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-[#6b4226] bg-[#5a3210]">
        <h2 className="text-sm text-amber-200 font-bold">{title}</h2>
        <button onClick={onClose} className="text-amber-400 hover:text-white text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">{children}</div>
    </div>
  </div>);
}
function Btn({ children, onClick, disabled, v = "green" }: { children: ReactNode; onClick: () => void; disabled?: boolean; v?: string }) {
  return <button onClick={onClick} disabled={disabled} className={`bg-${v}-700 hover:bg-${v}-600 disabled:opacity-30 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold shrink-0`}>{children}</button>;
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
  const [selCell, setSelCell] = useState<{ x: number; y: number } | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(i); }, []);

  const curLvl = LEVELS.find(l => l.level === level); const nextLvl = LEVELS.find(l => l.level === level + 1);
  const xpCur = g.xp - (curLvl?.xp || 0); const xpNeed = Math.max(1, (nextLvl?.xp || g.xp + 1) - (curLvl?.xp || 0));

  const cellClick = (x: number, y: number) => {
    const cell = g.grid[y]?.[x]; if (!cell) return;
    if (cell.type === "plot") {
      if (cell.cropId && cell.plantedAt) {
        const c = CROPS.find(cr => cr.id === cell.cropId);
        if (c && Date.now() - cell.plantedAt >= c.growMs) { G.harvest(x, y); return; }
      }
      if (!cell.cropId) { setSelCell({ x, y }); return; }
    }
    if (["tree", "rock", "iron", "gold"].includes(cell.type)) { G.harvestNode(x, y); }
    if (cell.type === "beehive" && cell.beehiveIdx !== undefined) { G.beehiveAction(cell.beehiveIdx); }
  };

  // Render a grid cell
  const renderCell = (cell: Cell | null, x: number, y: number) => {
    if (!cell) return <div key={`${x}-${y}`} style={{ width: CS, height: CS }} />;
    const base = "relative flex flex-col items-center justify-center transition-all cursor-pointer";

    if (cell.type === "empty") return (
      <div key={`${x}-${y}`} className={base} style={{ width: CS, height: CS, background: "#4a8c3f", border: "1px solid #3d7a25" }} />
    );

    if (cell.type === "plot") {
      const crop = cell.cropId ? CROPS.find(c => c.id === cell.cropId) : null;
      const elapsed = cell.plantedAt ? Date.now() - cell.plantedAt : 0;
      const ready = crop ? elapsed >= crop.growMs : false;
      const progress = crop ? Math.min(1, elapsed / crop.growMs) : 0;
      return (
        <div key={`${x}-${y}`} onClick={() => cellClick(x, y)}
          className={`${base} hover:brightness-110 active:scale-95 rounded`}
          style={{ width: CS, height: CS, background: "#6b4226", border: ready ? "2px solid #ffd700" : "1px solid #4a2f1a", boxShadow: ready ? "0 0 6px #ffd700" : "inset 0 1px 3px rgba(0,0,0,0.3)" }}>
          {crop ? <>
            <span className="text-xl leading-none">{crop.emoji}</span>
            {!ready && <span className="text-[8px] text-amber-200 leading-none">{fmt(crop.growMs - elapsed)}</span>}
            {!ready && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b"><div className="h-full bg-green-400 rounded-b" style={{ width: `${progress * 100}%` }} /></div>}
            {ready && <span className="text-[8px] text-yellow-300 font-bold">Собрать</span>}
          </> : <span className="text-lg opacity-20">🌱</span>}
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
          className={`${base} rounded ${ok && hasTool ? "hover:scale-105" : "opacity-40"}`}
          style={{ width: CS, height: CS, background: "#2d5a1e", border: "1px solid #1d4a10" }}>
          <span className="text-xl leading-none">{def.emoji}</span>
          {cd > 0 && <span className="text-[7px] text-yellow-300 leading-none">{fmt(cd)}</span>}
          {ok && !hasTool && <span className="text-[7px] text-red-400 leading-none">🔧нет</span>}
          {ok && hasTool && <span className="text-[7px] text-green-300 leading-none">Готов</span>}
        </div>
      );
    }

    if (cell.type === "building") {
      const b = BUILDINGS.find(x => x.id === cell.buildingId);
      return (
        <div key={`${x}-${y}`} className={base} style={{ width: CS, height: CS, background: "#5a3210", border: "1px solid #3e2210", borderRadius: 4 }}>
          <span className="text-xl leading-none">{b?.emoji || "🏠"}</span>
          <span className="text-[7px] text-amber-200 leading-none truncate w-full text-center">{b?.name || ""}</span>
        </div>
      );
    }

    if (cell.type === "beehive") {
      const h = g.beehives[cell.beehiveIdx || 0];
      const cd = h?.lastAction ? BEEHIVE_ACTION_INTERVAL - (Date.now() - h.lastAction) : 0;
      const ok = cd <= 0;
      return (
        <div key={`${x}-${y}`} onClick={() => cellClick(x, y)}
          className={`${base} rounded ${ok ? "hover:scale-105" : "opacity-50"}`}
          style={{ width: CS, height: CS, background: "#8B6914", border: "1px solid #6b5210" }}>
          <span className="text-xl leading-none">🐝</span>
          <span className="text-[7px] text-amber-200 leading-none">{h?.level === 0 ? "Демо" : `Ур${h?.level}`}</span>
          {cd > 0 && <span className="text-[7px] text-yellow-300 leading-none">{fmt(cd)}</span>}
        </div>
      );
    }

    return <div key={`${x}-${y}`} style={{ width: CS, height: CS, background: "#4a8c3f" }} />;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "linear-gradient(180deg,#87CEEB 0%,#5da33a 40%,#3d7a25 100%)" }}>
      {/* HUD */}
      <header className="shrink-0 flex items-center justify-between px-3 py-1.5 bg-[#3e2210]/90 border-b-2 border-[#6b4226] z-20">
        <div className="flex items-center gap-1.5">
          <div className="bg-[#5a3210] rounded-lg px-2 py-1 flex items-center gap-1.5 border border-[#6b4226] text-[11px]">
            ⭐ Ур.{level}
            <div className="w-14 h-1.5 bg-[#3e2210] rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(xpCur / xpNeed) * 100}%` }} /></div>
            <span className="text-gray-400">{g.xp}xp</span>
          </div>
          <div className="bg-[#5a3210] rounded-lg px-2 py-1 flex items-center gap-1 border border-[#6b4226] text-[11px]">🪙 {g.coins.toFixed(2)}</div>
          <div className="bg-[#5a3210] rounded-lg px-2 py-1 flex items-center gap-1 border border-[#6b4226] text-[11px]">🌸 {g.pollen.toFixed(1)}</div>
        </div>
        <div className="text-[10px] text-amber-200/50">Территория: {g.gridW}×{g.gridH}</div>
      </header>

      {/* Menu */}
      <nav className="shrink-0 flex gap-1 px-2 py-1 bg-[#5a3210]/50 border-b border-[#6b4226]/40 overflow-x-auto z-10">
        {([["shop","🏪","Рынок"],["inv","📦","Инвентарь"],["cook","🍳","Готовка"],["craft","🔨","Верстак"],["build","🏗️","Стройка"],["animals","🐔","Животные"],["beehive","🐝","Пчёлы"],["expand","🗺️","Земля"]] as [PanelId,string,string][]).map(([id,icon,label])=>(
          <button key={id!} onClick={()=>setPanel(panel===id?null:id)} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] shrink-0 ${panel===id?"bg-amber-600 text-white":"bg-[#3e2210]/60 text-amber-200 hover:bg-[#5a3210]"}`}>
            <span>{icon}</span><span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* GRID MAP */}
      <main className="flex-1 overflow-auto p-3 flex items-start justify-center">
        <div className="inline-grid gap-px bg-[#2d6b35] p-1 rounded-lg border-2 border-[#1d5a20]" style={{ gridTemplateColumns: `repeat(${g.gridW}, ${CS}px)` }}>
          {g.grid.map((row, y) => row.map((cell, x) => renderCell(cell, x, y)))}
        </div>
      </main>

      {/* Plant popup */}
      {selCell && <Panel title={`🌱 Посадить (${selCell.x},${selCell.y})`} onClose={() => setSelCell(null)}>
        {crops.map(c => { const seeds = g.inventory[`${c.id}_seed`] || 0; return (
          <Row key={c.id} emoji={c.emoji} title={c.name} sub={`${fmt(c.growMs)} · ×${c.harvest} · семян: ${seeds}`}>
            <Btn onClick={() => { G.plant(selCell.x, selCell.y, c.id); setSelCell(null); }} disabled={seeds < 1}>Посадить</Btn>
          </Row>); })}
      </Panel>}

      {/* Shop */}
      {panel === "shop" && <Panel title="🏪 Рынок" onClose={() => setPanel(null)}>
        <div className="text-[11px] text-amber-300 mb-2">Баланс: 🪙 {g.coins.toFixed(2)}</div>
        <div className="text-[10px] text-gray-400 mb-1 font-bold">Семена</div>
        {crops.map(c => (<Row key={c.id} emoji={c.emoji} title={c.name} sub={`${fmt(c.growMs)} · ×${c.harvest} · продажа 🪙${c.sellPrice}`}>
          <Btn onClick={() => G.buySeed(c.id, 1)} disabled={g.coins < c.seedPrice}>🪙{c.seedPrice}</Btn>
          <Btn onClick={() => G.buySeed(c.id, 10)} disabled={g.coins < c.seedPrice * 10}>×10</Btn>
        </Row>))}
        <div className="text-[10px] text-gray-400 mb-1 mt-3 font-bold">Инструменты</div>
        {[{id:"axe",name:"Топор",emoji:"🪓",price:0.05},{id:"stone_pickaxe",name:"Кам.кирка",emoji:"⛏️",price:0.20},{id:"iron_pickaxe",name:"Жел.кирка",emoji:"⛏️",price:1.00},{id:"gold_pickaxe",name:"Зол.кирка",emoji:"⛏️",price:5.00}].map(t=>(
          <Row key={t.id} emoji={t.emoji} title={`${t.name} (×${g.inventory[t.id]||0})`} sub={`Для: ${TOOLS.find(x=>x.id===t.id)?.forResource||"?"}`}>
            <Btn onClick={()=>G.buyTool(t.id,1)} disabled={g.coins<t.price}>🪙{t.price}</Btn>
            <Btn onClick={()=>G.buyTool(t.id,5)} disabled={g.coins<t.price*5}>×5</Btn>
          </Row>
        ))}
      </Panel>}

      {/* Inventory */}
      {panel === "inv" && <Panel title="📦 Инвентарь" onClose={() => setPanel(null)}>
        {Object.keys(g.inventory).length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Пусто</p> :
          <div className="grid grid-cols-3 gap-1.5">{Object.entries(g.inventory).map(([id, count]) => {
            const price = iPrice(id);
            return (<div key={id} className="relative bg-[#5a3210]/50 rounded-lg p-2 flex flex-col items-center gap-0.5">
              <span className="text-xl">{iEmoji(id)}</span>
              <span className="text-[9px] text-amber-200 text-center leading-tight">{iName(id)}</span>
              <span className="absolute top-0.5 right-0.5 bg-amber-700 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">{count}</span>
              {price > 0 && <Btn onClick={() => G.sell(id, 1)} v="amber">🪙{price}</Btn>}
            </div>);
          })}</div>}
      </Panel>}

      {/* Cook */}
      {panel === "cook" && <Panel title="🍳 Готовка → XP" onClose={() => setPanel(null)}>
        {RECIPES.filter(r => g.buildings.includes(r.building)).length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Постройте Костёр, Кухню или Пекарню</p> :
          RECIPES.filter(r => g.buildings.includes(r.building)).map(r => {
            const can = r.ingredients.every(i => (g.inventory[i.id] || 0) >= i.n);
            return <Row key={r.id} emoji={r.emoji} title={`${r.name}  +${r.xp}XP`} sub={r.ingredients.map(i => `${iEmoji(i.id)}×${i.n}`).join(" + ")}><Btn onClick={() => G.cook(r.id)} disabled={!can} v="amber">Готовить</Btn></Row>;
          })}
      </Panel>}

      {/* Craft */}
      {panel === "craft" && <Panel title="🔨 Крафт инструментов" onClose={() => setPanel(null)}>
        {TOOLS.map(tool => { const can = Object.entries(tool.cost).every(([r, a]) => (g.inventory[r] || 0) >= a);
          return <Row key={tool.id} emoji={tool.emoji} title={`${tool.name} (×${g.inventory[tool.id] || 0})`} sub={Object.entries(tool.cost).map(([r, a]) => `${iName(r)}×${a}`).join(" + ")}>
            <Btn onClick={() => G.craftTool(tool.id, 1)} disabled={!can}>×1</Btn><Btn onClick={() => G.craftTool(tool.id, 5)} disabled={!can}>×5</Btn></Row>; })}
      </Panel>}

      {/* Build */}
      {panel === "build" && <Panel title="🏗️ Строительство" onClose={() => setPanel(null)}>
        {G.availBuildings.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">Все доступные здания построены</p> :
          G.availBuildings.map(b => { const can = Object.entries(b.cost).every(([r, a]) => r === "coins" ? g.coins >= a : (g.inventory[r] || 0) >= a);
            return <Row key={b.id} emoji={b.emoji} title={`${b.name} (ур.${b.level}+)`} sub={`${b.desc}\n${Object.entries(b.cost).map(([r, a]) => `${r === "coins" ? "🪙" : iName(r)}×${a}`).join(" + ") || "Бесплатно"}`}>
              <Btn onClick={() => G.build(b.id)} disabled={!can}>Построить</Btn></Row>; })}
      </Panel>}

      {/* Expand */}
      {panel === "expand" && <Panel title="🗺️ Расширение" onClose={() => setPanel(null)}>
        <div className="text-[11px] text-amber-300 mb-2">Территория: {g.gridW}×{g.gridH} · Расширение: {g.expansion}/{EXPANSIONS.length}</div>
        {(() => { const e = EXPANSIONS[g.expansion]; if (!e) return <p className="text-green-300 text-sm text-center py-4">✅ Все расширения!</p>;
          const can = level >= e.minLevel && Object.entries(e.cost).every(([r, a]) => r === "coins" ? g.coins >= a : (g.inventory[r] || 0) >= a);
          return <div className="bg-[#5a3210]/40 rounded-xl p-3 space-y-2">
            <div className="text-sm text-amber-100 font-bold">Расширение #{e.id} (мин.ур.{e.minLevel})</div>
            <div className="text-xs text-amber-300">{Object.entries(e.cost).map(([r, a]) => `${r === "coins" ? "🪙" : iName(r)}×${a}`).join(", ")}</div>
            <div className="text-xs text-green-300">+{e.adds.plots}грядок +{e.adds.trees}дер. +{e.adds.rocks}камн.{e.adds.iron > 0 ? ` +${e.adds.iron}жел.` : ""}{e.adds.gold > 0 ? ` +${e.adds.gold}зол.` : ""}</div>
            <Btn onClick={() => { G.expand(); setPanel(null); }} disabled={!can}>{can ? "🔓 Расширить" : `🔒 Ур.${e.minLevel}`}</Btn>
          </div>; })()}
      </Panel>}

      {/* Animals */}
      {panel === "animals" && <Panel title="🐔 Животные" onClose={() => setPanel(null)}>
        {!g.buildings.includes("henhouse") && !g.buildings.includes("barn") ? <p className="text-gray-400 text-sm text-center py-4">Постройте Курятник или Хлев</p> : <>
          {g.buildings.includes("henhouse") && <><div className="text-[11px] text-amber-200 font-bold mb-1">🐔 Куры ({g.animals.filter(a => a.type === "chicken").length}/10)</div>
            {g.animals.filter(a => a.type === "chicken").map(a => { const idx = g.animals.indexOf(a); let lvl = CHICKEN_LEVELS[0]; for (const l of CHICKEN_LEVELS) if (a.xp >= l.xpNeeded) lvl = l; const ready = a.lastFed && Date.now() - a.lastFed >= lvl.timeMs; const cd = a.lastFed ? lvl.timeMs - (Date.now() - a.lastFed) : 0;
              return <Row key={idx} emoji="🐔" title={`Ур.${lvl.level} XP:${a.xp}`} sub={a.lastFed && !ready ? fmt(cd) : ready ? "🥚 Готово!" : `Корм: ${lvl.feedCost}🌾`}>
                {!a.lastFed && <Btn onClick={() => G.feedAnimal(idx)} disabled={(g.inventory.wheat || 0) < lvl.feedCost}>Кормить</Btn>}
                {ready && <Btn onClick={() => G.collectAnimal(idx)} v="amber">Собрать</Btn>}</Row>; })}
            <div className="mt-1"><Btn onClick={G.buyChicken} disabled={g.coins < 5 || g.animals.filter(a => a.type === "chicken").length >= 10}>+🐔 (5🪙)</Btn></div></>}
          {g.buildings.includes("barn") && <><div className="text-[11px] text-amber-200 font-bold mb-1 mt-3">🐄 Коровы ({g.animals.filter(a => a.type === "cow").length}/10)</div>
            {g.animals.filter(a => a.type === "cow").map(a => { const idx = g.animals.indexOf(a); let lvl = COW_LEVELS[0]; for (const l of COW_LEVELS) if (a.xp >= l.xpNeeded) lvl = l; const ready = a.lastFed && Date.now() - a.lastFed >= lvl.timeMs; const cd = a.lastFed ? lvl.timeMs - (Date.now() - a.lastFed) : 0;
              return <Row key={idx} emoji="🐄" title={`Ур.${lvl.level} XP:${a.xp}`} sub={a.lastFed && !ready ? fmt(cd) : ready ? "🥛 Готово!" : "Корм: 5🌾"}>
                {!a.lastFed && <Btn onClick={() => G.feedAnimal(idx)} disabled={(g.inventory.wheat || 0) < 5}>Кормить</Btn>}
                {ready && <Btn onClick={() => G.collectAnimal(idx)} v="amber">Собрать</Btn>}</Row>; })}
            <div className="mt-1"><Btn onClick={G.buyCow} disabled={g.coins < 50 || g.animals.filter(a => a.type === "cow").length >= 10}>+🐄 (50🪙)</Btn></div></>}
        </>}</Panel>}

      {/* Beehive */}
      {panel === "beehive" && <Panel title="🐝 Пчёлы" onClose={() => setPanel(null)}>
        <div className="text-[11px] text-amber-300 mb-2">🌸 {g.pollen.toFixed(1)} · Слотов: {g.beehives.length}/{maxBeehiveSlots(level)}</div>
        {g.beehives.map((h, i) => { const cd = h.lastAction ? BEEHIVE_ACTION_INTERVAL - (Date.now() - h.lastAction) : 0; const ok = cd <= 0; const pct = h.level === 0 ? (h.actions / BEEHIVE_ACTIONS_TO_UPGRADE) * 100 : 100;
          return <div key={i} className="bg-[#5a3210]/40 rounded-lg p-2 space-y-1">
            <div className="flex items-center gap-2"><span className="text-xl">🐝</span><div className="flex-1">
              <div className="text-[11px] text-amber-100">{h.level === 0 ? "Демо" : `Ур.${h.level}`}</div>
              {h.level === 0 && <div className="text-[9px] text-gray-400">{h.actions}/{BEEHIVE_ACTIONS_TO_UPGRADE} ({pct.toFixed(0)}%)</div>}
            </div>{ok ? <Btn onClick={() => G.beehiveAction(i)}>Действие</Btn> : <span className="text-[10px] text-yellow-300">{fmt(cd)}</span>}</div>
            {h.level === 0 && <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} /></div>}
          </div>; })}
        {maxBeehiveSlots(level) > g.beehives.length && <div className="mt-2"><Btn onClick={G.buyBeehive} disabled={g.pollen < 1000}>+🐝 (1000🌸)</Btn></div>}
      </Panel>}
    </div>
  );
}
