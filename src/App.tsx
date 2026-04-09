import { useState, useEffect } from "react";
import { useGame } from "./hooks/useGame";
import { CROPS, RECIPES, getLevel, LEVELS } from "./data/crops";

function fmt(ms: number) {
  if (ms <= 0) return "Готово!";
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  return h > 0 ? `${h}ч ${m % 60}м` : m > 0 ? `${m}м ${s % 60}с` : `${s}с`;
}

export default function App() {
  const { g, level, crops, buySeed, plant, harvest, sell, cook } = useGame();
  const [panel, setPanel] = useState<string | null>(null);
  const [selPlot, setSelPlot] = useState<number | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(i); }, []);

  const xpCur = g.xp - (LEVELS.find(l => l.level === level)?.xp || 0);
  const xpNext = (LEVELS.find(l => l.level === level + 1)?.xp || g.xp) - (LEVELS.find(l => l.level === level)?.xp || 0);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #6baa3f 60%, #4a7a2e 100%)" }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-3 py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-brown-700 border-2 border-brown-600 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
            <span className="text-[10px]">⭐</span>
            <span className="text-[10px] text-amber-200">Ур.{level}</span>
            <div className="w-12 h-1.5 bg-brown-600 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${xpNext > 0 ? (xpCur / xpNext) * 100 : 100}%` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-brown-700 border-2 border-brown-600 rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-lg">
            <img src="/icons/coin.png" className="w-4 h-4" alt="" />
            <span className="text-[10px] text-amber-200">{g.coins.toFixed(2)}</span>
          </div>
          <button onClick={() => setPanel(panel === "inv" ? null : "inv")} className="bg-brown-700 hover:bg-brown-500 border-2 border-brown-600 rounded-lg px-2 py-1.5 text-[10px] shadow-lg">📦</button>
          <button onClick={() => setPanel(panel === "shop" ? null : "shop")} className="bg-brown-700 hover:bg-brown-500 border-2 border-brown-600 rounded-lg px-2 py-1.5 text-[10px] shadow-lg">🏪</button>
          <button onClick={() => setPanel(panel === "cook" ? null : "cook")} className="bg-brown-700 hover:bg-brown-500 border-2 border-brown-600 rounded-lg px-2 py-1.5 text-[10px] shadow-lg">🍳</button>
        </div>
      </div>

      {/* Farm area */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(5, g.plots.length)}, 80px)` }}>
          {g.plots.map((plot, i) => {
            const crop = plot.cropId ? CROPS.find(c => c.id === plot.cropId) : null;
            const elapsed = plot.plantedAt ? Date.now() - plot.plantedAt : 0;
            const ready = crop ? elapsed >= crop.growMs : false;
            const progress = crop ? Math.min(1, elapsed / crop.growMs) : 0;
            const stageIdx = crop ? Math.min(crop.stages - 1, Math.floor(progress * crop.stages)) : 0;

            return (
              <div key={i}
                className="relative w-20 h-20 rounded-lg cursor-pointer transition-transform hover:scale-105"
                style={{ background: "#6b4226", border: ready ? "3px solid #ffd700" : "2px solid #4a2f1a", boxShadow: ready ? "0 0 12px #ffd700" : "inset 0 2px 6px rgba(0,0,0,0.4)" }}
                onClick={() => { if (ready) harvest(i); else if (!crop) setSelPlot(i); }}
              >
                {/* Soil texture */}
                <div className="absolute inset-1 rounded bg-gradient-to-b from-[#8B5E3C] to-[#6b4226] opacity-50" />

                {crop && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Crop sprite from spritesheet */}
                    <div className="w-10 h-16 overflow-hidden" style={{ imageRendering: "pixelated" }}>
                      <img src={crop.sprite} alt={crop.name}
                        className="h-full"
                        style={{ width: `${crop.stages * 100}%`, objectFit: "cover", objectPosition: `${-stageIdx * 40}px 0` }}
                      />
                    </div>
                    {!ready && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 rounded-b">
                          <div className="h-full bg-green-400 rounded-b transition-all" style={{ width: `${progress * 100}%` }} />
                        </div>
                        <span className="absolute bottom-2 text-[7px] text-amber-200 drop-shadow">{fmt(crop.growMs - elapsed)}</span>
                      </>
                    )}
                    {ready && <span className="absolute bottom-1 text-[8px] text-yellow-300 font-bold animate-bounce">Собрать!</span>}
                  </div>
                )}
                {!crop && (
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] text-amber-700/50">
                    грядка
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Plant popup */}
      {selPlot !== null && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-brown-700 border-2 border-brown-600 rounded-xl p-3 shadow-2xl">
          <div className="text-[10px] text-amber-200 mb-2">🌱 Посадить</div>
          <div className="flex gap-2 flex-wrap max-w-xs">
            {crops.map(c => {
              const seeds = g.inventory[`${c.id}_seed`] || 0;
              return (
                <button key={c.id} disabled={seeds < 1}
                  onClick={() => { plant(selPlot, c.id); setSelPlot(null); }}
                  className="flex flex-col items-center bg-brown-600/60 hover:bg-brown-500 disabled:opacity-30 rounded-lg p-2 min-w-[56px] transition-colors">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="text-[8px] text-amber-200">{c.name}</span>
                  <span className="text-[7px] text-gray-400">×{seeds}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => setSelPlot(null)} className="mt-2 text-[8px] text-gray-400 hover:text-white">✕ Закрыть</button>
        </div>
      )}

      {/* Shop panel */}
      {panel === "shop" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60" onClick={() => setPanel(null)}>
          <div className="bg-brown-700 border-2 border-brown-600 rounded-2xl p-4 w-80 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-3">
              <span className="text-[11px] text-amber-200 font-bold">🏪 Рынок семян</span>
              <span className="text-[10px] text-amber-200">🪙 {g.coins.toFixed(2)}</span>
            </div>
            {crops.map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-brown-600/40 rounded-lg p-2 mb-1.5">
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="text-[10px] text-amber-100">{c.name}</div>
                  <div className="text-[8px] text-gray-400">{fmt(c.growMs)} · ×{c.harvest} · 🪙{c.sellPrice}</div>
                </div>
                <button onClick={() => buySeed(c.id, 1)} disabled={g.coins < c.seedPrice}
                  className="text-[8px] bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white px-2 py-1 rounded">
                  🪙{c.seedPrice}
                </button>
                <button onClick={() => buySeed(c.id, 10)} disabled={g.coins < c.seedPrice * 10}
                  className="text-[8px] bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white px-2 py-1 rounded">
                  ×10
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory panel */}
      {panel === "inv" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60" onClick={() => setPanel(null)}>
          <div className="bg-brown-700 border-2 border-brown-600 rounded-2xl p-4 w-72 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className="text-[11px] text-amber-200 font-bold mb-3 block">📦 Инвентарь</span>
            {Object.keys(g.inventory).length === 0 ? <div className="text-[9px] text-gray-500 py-3 text-center">Пусто</div> : (
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(g.inventory).map(([id, count]) => {
                  const crop = CROPS.find(c => c.id === id);
                  const isSeed = id.endsWith("_seed");
                  const seedCrop = isSeed ? CROPS.find(c => c.id === id.replace("_seed", "")) : null;
                  const emoji = crop?.emoji || seedCrop?.emoji || (id === "wood" ? "🪵" : id === "stone" ? "🪨" : "📦");
                  const name = crop?.name || (seedCrop ? `${seedCrop.name} сем.` : id);
                  return (
                    <div key={id} className="relative bg-brown-600/50 rounded-lg p-1.5 flex flex-col items-center">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-[7px] text-amber-200 truncate w-full text-center">{name}</span>
                      <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">{count}</span>
                      {crop && <button onClick={() => sell(id, 1)} className="text-[7px] bg-green-800 hover:bg-green-700 text-green-200 px-1 py-0.5 rounded mt-0.5">🪙{crop.sellPrice}</button>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cook panel */}
      {panel === "cook" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60" onClick={() => setPanel(null)}>
          <div className="bg-brown-700 border-2 border-brown-600 rounded-2xl p-4 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className="text-[11px] text-amber-200 font-bold mb-3 block">🍳 Готовка (XP)</span>
            {RECIPES.map(r => {
              const can = r.ingredients.every(i => (g.inventory[i.id] || 0) >= i.n);
              return (
                <div key={r.id} className="flex items-center gap-2 bg-brown-600/40 rounded-lg p-2 mb-1.5">
                  <span className="text-xl">{r.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[10px] text-amber-100">{r.name} <span className="text-yellow-400">+{r.xp}XP</span></div>
                    <div className="text-[8px] text-gray-400">{r.ingredients.map(i => `${CROPS.find(c => c.id === i.id)?.emoji || "?"} ×${i.n}`).join(" + ")}</div>
                  </div>
                  <button onClick={() => cook(r.id)} disabled={!can} className="text-[8px] bg-amber-800 hover:bg-amber-700 disabled:opacity-30 text-white px-2 py-1 rounded">Готовить</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
