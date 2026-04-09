import { useState, useEffect } from "react";
import { useGame } from "./hooks/useGame";
import { CROPS, RECIPES, LEVELS, getLevel, SPRITE_SIZE, SPRITE_FRAMES, RESOURCE_NODES, EXPANSIONS } from "./data/crops";

const PLOT_SIZE = 64; // px per plot cell

function fmt(ms: number) {
  if (ms <= 0) return "Готово!";
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  return h > 0 ? `${h}ч ${m % 60}м` : m > 0 ? `${m}м ${s % 60}с` : `${s}с`;
}

function CropSprite({ sprite, progress }: { sprite: string; progress: number }) {
  // 11 frames, show frame based on progress (0-1)
  const frame = Math.min(SPRITE_FRAMES - 1, Math.floor(progress * SPRITE_FRAMES));
  return (
    <div className="w-9 h-9 overflow-hidden mx-auto" style={{ imageRendering: "pixelated" }}>
      <img src={sprite} alt="" draggable={false}
        style={{ width: SPRITE_FRAMES * SPRITE_SIZE, height: SPRITE_SIZE, objectFit: "none", objectPosition: `-${frame * SPRITE_SIZE}px 0` }} />
    </div>
  );
}

export default function App() {
  const { g, level, crops, buySeed, plant, harvest, sell, cook, harvestNode, expand } = useGame();
  const [panel, setPanel] = useState<string | null>(null);
  const [selPlot, setSelPlot] = useState<number | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(i); }, []);

  const curLvl = LEVELS.find(l => l.level === level);
  const nextLvl = LEVELS.find(l => l.level === level + 1);
  const xpCur = g.xp - (curLvl?.xp || 0);
  const xpNeed = (nextLvl?.xp || g.xp) - (curLvl?.xp || 0);
  const nextExp = EXPANSIONS[g.expansion];
  const canExpand = nextExp && level >= nextExp.minLevel;

  const plotCols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(g.plots.length))));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #5da33a 50%, #3d7a25 100%)" }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-2 py-1.5 z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="bg-brown-700/90 border border-brown-600 rounded px-2 py-1 flex items-center gap-1 text-[9px]">
            ⭐ <span className="text-amber-200">Ур.{level}</span>
            <div className="w-10 h-1 bg-brown-600 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${xpNeed > 0 ? (xpCur / xpNeed) * 100 : 100}%` }} /></div>
            <span className="text-gray-400">{g.xp}xp</span>
          </div>
          <div className="bg-brown-700/90 border border-brown-600 rounded px-2 py-1 flex items-center gap-1 text-[9px]">
            <img src="/icons/coin.png" className="w-3 h-3" alt="" /> <span className="text-amber-200">{g.coins.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: "shop", icon: "🏪", label: "Рынок" },
            { id: "inv", icon: "📦", label: "Инвентарь" },
            { id: "cook", icon: "🍳", label: "Готовка" },
            { id: "expand", icon: "🗺️", label: "Расширение" },
          ].map(b => (
            <button key={b.id} onClick={() => setPanel(panel === b.id ? null : b.id)}
              className={`bg-brown-700/90 hover:bg-brown-500 border border-brown-600 rounded px-2 py-1 text-[9px] ${panel === b.id ? "ring-1 ring-yellow-400" : ""}`}
              title={b.label}>{b.icon}</button>
          ))}
        </div>
      </div>

      {/* FARM */}
      <div className="flex-1 overflow-auto flex items-start justify-center pt-2 pb-4 px-2">
        <div className="flex flex-col items-center gap-4">
          {/* Plots grid */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${plotCols}, ${PLOT_SIZE}px)` }}>
            {g.plots.map((plot, i) => {
              const crop = plot.cropId ? CROPS.find(c => c.id === plot.cropId) : null;
              const elapsed = plot.plantedAt ? Date.now() - plot.plantedAt : 0;
              const ready = crop ? elapsed >= crop.growMs : false;
              const progress = crop ? Math.min(1, elapsed / crop.growMs) : 0;
              return (
                <div key={i} className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{ width: PLOT_SIZE, height: PLOT_SIZE, background: "#6b4226", borderRadius: 4,
                    border: ready ? "2px solid #ffd700" : "1px solid #4a2f1a",
                    boxShadow: ready ? "0 0 8px #ffd700" : "inset 0 1px 3px rgba(0,0,0,0.4)" }}
                  onClick={() => { if (ready) harvest(i); else if (!crop) setSelPlot(i); }}>
                  <div className="absolute inset-0.5 rounded-sm bg-gradient-to-b from-[#8B5E3C]/40 to-transparent" />
                  {crop ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <CropSprite sprite={crop.sprite} progress={progress} />
                      {!ready && <span className="text-[7px] text-amber-200 mt-0.5">{fmt(crop.growMs - elapsed)}</span>}
                      {!ready && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b"><div className="h-full bg-green-400 rounded-b" style={{ width: `${progress * 100}%` }} /></div>}
                      {ready && <span className="text-[7px] text-yellow-300 font-bold animate-pulse">✅ Собрать</span>}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-amber-700/40">🌱</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resource nodes */}
          <div className="flex flex-wrap gap-2 justify-center">
            {g.nodes.map((node, i) => {
              const def = RESOURCE_NODES[node.type];
              if (!def) return null;
              const now = Date.now();
              const cd = node.lastHarvest ? def.cooldownMs - (now - node.lastHarvest) : 0;
              const canHarvest = cd <= 0 && (node.hitsLeft < 0 || node.hitsLeft > 0);
              const depleted = node.hitsLeft === 0;
              return (
                <div key={i} className={`relative flex flex-col items-center justify-center cursor-pointer transition-transform ${canHarvest ? "hover:scale-110" : "opacity-50"}`}
                  style={{ width: 52, height: 52, background: "#3d5a1e", borderRadius: 6, border: "1px solid #2d4a15" }}
                  onClick={() => canHarvest && harvestNode(i)}>
                  {def.img ? <img src={def.img} className="w-8 h-8" style={{ imageRendering: "pixelated" }} alt="" /> : <span className="text-2xl">{def.emoji}</span>}
                  <span className="text-[7px] text-green-200">{def.resource}</span>
                  {cd > 0 && <span className="absolute bottom-0 text-[6px] text-yellow-300 bg-black/50 px-1 rounded">{fmt(cd)}</span>}
                  {depleted && <span className="absolute inset-0 flex items-center justify-center text-[7px] text-red-300 bg-black/40 rounded">Пусто</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Plant popup */}
      {selPlot !== null && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 bg-brown-700/95 border border-brown-600 rounded-lg p-2 shadow-xl backdrop-blur">
          <div className="text-[9px] text-amber-200 mb-1.5">🌱 Посадить на грядку #{selPlot + 1}</div>
          <div className="flex gap-1.5 flex-wrap max-w-[300px]">
            {crops.map(c => {
              const seeds = g.inventory[`${c.id}_seed`] || 0;
              return (
                <button key={c.id} disabled={seeds < 1}
                  onClick={() => { plant(selPlot, c.id); setSelPlot(null); }}
                  className="flex flex-col items-center bg-brown-600/50 hover:bg-brown-500 disabled:opacity-25 rounded p-1.5 min-w-[48px] transition-colors">
                  <span className="text-base">{c.emoji}</span>
                  <span className="text-[7px] text-amber-200">{c.name}</span>
                  <span className="text-[6px] text-gray-400">×{seeds}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setSelPlot(null)} className="mt-1.5 text-[7px] text-gray-400 hover:text-white">✕ Закрыть</button>
        </div>
      )}

      {/* PANELS */}
      {panel && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPanel(null)}>
          <div className="bg-brown-700 border-2 border-brown-600 rounded-xl p-3 w-[320px] max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

            {panel === "shop" && <>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-amber-200 font-bold">🏪 Рынок семян</span>
                <span className="text-[9px] text-amber-200">🪙 {g.coins.toFixed(2)}</span>
              </div>
              {crops.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-brown-600/30 rounded p-1.5 mb-1">
                  <span className="text-lg">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-amber-100">{c.name}</div>
                    <div className="text-[7px] text-gray-400 truncate">{fmt(c.growMs)} · ×{c.harvest} · 🪙{c.sellPrice}</div>
                  </div>
                  <button onClick={() => buySeed(c.id, 1)} disabled={g.coins < c.seedPrice}
                    className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white px-1.5 py-0.5 rounded shrink-0">🪙{c.seedPrice}</button>
                  <button onClick={() => buySeed(c.id, 10)} disabled={g.coins < c.seedPrice * 10}
                    className="text-[7px] bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white px-1.5 py-0.5 rounded shrink-0">×10</button>
                </div>
              ))}
            </>}

            {panel === "inv" && <>
              <span className="text-[10px] text-amber-200 font-bold mb-2 block">📦 Инвентарь</span>
              {Object.keys(g.inventory).length === 0 ? <div className="text-[8px] text-gray-500 py-3 text-center">Пусто</div> : (
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(g.inventory).map(([id, count]) => {
                    const crop = CROPS.find(c => c.id === id);
                    const isSeed = id.endsWith("_seed");
                    const seedCrop = isSeed ? CROPS.find(c => c.id === id.replace("_seed", "")) : null;
                    const emoji = crop?.emoji || seedCrop?.emoji || ({ wood: "🪵", stone: "🪨", iron: "⛏️", gold: "🪙" }[id] || "📦");
                    const name = crop?.name || (seedCrop ? `${seedCrop.name} сем.` : id);
                    return (
                      <div key={id} className="relative bg-brown-600/40 rounded p-1 flex flex-col items-center">
                        <span className="text-base">{emoji}</span>
                        <span className="text-[6px] text-amber-200 truncate w-full text-center">{name}</span>
                        <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-[7px] font-bold rounded-full min-w-[12px] h-3 flex items-center justify-center px-0.5">{count}</span>
                        {crop && <button onClick={() => sell(id, 1)} className="text-[6px] bg-green-800 hover:bg-green-700 text-green-200 px-1 rounded mt-0.5">🪙{crop.sellPrice}</button>}
                      </div>
                    );
                  })}
                </div>
              )}
            </>}

            {panel === "cook" && <>
              <span className="text-[10px] text-amber-200 font-bold mb-2 block">🍳 Готовка → XP</span>
              {RECIPES.map(r => {
                const can = r.ingredients.every(i => (g.inventory[i.id] || 0) >= i.n);
                return (
                  <div key={r.id} className="flex items-center gap-2 bg-brown-600/30 rounded p-1.5 mb-1">
                    <span className="text-lg">{r.emoji}</span>
                    <div className="flex-1">
                      <div className="text-[9px] text-amber-100">{r.name} <span className="text-yellow-400">+{r.xp}XP</span></div>
                      <div className="text-[7px] text-gray-400">{r.ingredients.map(i => `${CROPS.find(c => c.id === i.id)?.emoji || "?"} ×${i.n}`).join(" + ")}</div>
                    </div>
                    <button onClick={() => cook(r.id)} disabled={!can} className="text-[7px] bg-amber-800 hover:bg-amber-700 disabled:opacity-30 text-white px-1.5 py-0.5 rounded">Готовить</button>
                  </div>
                );
              })}
            </>}

            {panel === "expand" && <>
              <span className="text-[10px] text-amber-200 font-bold mb-2 block">🗺️ Расширение территории</span>
              <div className="text-[8px] text-gray-400 mb-2">Грядок: {g.plots.length} | Ресурсов: {g.nodes.length} | Расширение: {g.expansion}/{EXPANSIONS.length}</div>
              {nextExp ? (
                <div className="bg-brown-600/30 rounded p-2">
                  <div className="text-[9px] text-amber-100 mb-1">Расширение #{nextExp.id} (мин. ур. {nextExp.minLevel})</div>
                  <div className="text-[8px] text-gray-400 mb-1.5">
                    Стоимость: {Object.entries(nextExp.cost).map(([r, a]) => `${r === "coins" ? "🪙" : r} ×${a}`).join(", ")}
                  </div>
                  <div className="text-[8px] text-green-300 mb-2">
                    Добавит: +{nextExp.adds.plots} грядок, +{nextExp.adds.trees} деревьев, +{nextExp.adds.rocks} камней
                    {nextExp.adds.iron > 0 && `, +${nextExp.adds.iron} железо`}
                    {nextExp.adds.gold > 0 && `, +${nextExp.adds.gold} золото`}
                  </div>
                  <button onClick={() => { expand(); setPanel(null); }} disabled={!canExpand}
                    className="w-full text-[8px] bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white py-1.5 rounded">
                    {canExpand ? "🔓 Расширить" : `🔒 Нужен ур. ${nextExp.minLevel}`}
                  </button>
                </div>
              ) : (
                <div className="text-[8px] text-green-300 text-center py-3">✅ Все расширения выполнены!</div>
              )}
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
