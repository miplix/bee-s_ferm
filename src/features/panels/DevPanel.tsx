import { useStore } from "../../state/store";
import { CROPS } from "../../data/crops.data";
import { TOOLS } from "../../data/tools.data";
import { SEASON_ORDER, SEASON_DURATION_MS, SEASON_INFO, getCurrentSeason } from "../../domain/seasons/seasons";
import { getLevel } from "../../domain/level/level";
import { LEVEL_EXPERIENCE } from "../../domain/level/xpTable";
import type { IslandId, Season } from "../../domain/types/ids";

const RESOURCES = ["wood", "stone", "iron", "gold", "crimstone", "oil", "obsidian", "sunstone", "honey", "pollen", "egg", "milk", "wool"];

export function DevPanel() {
  const xp = useStore((s) => s.xp);
  const coins = useStore((s) => s.coins);
  const gems = useStore((s) => s.gems);
  const island = useStore((s) => s.island);
  const seasonAnchor = useStore((s) => s.seasonAnchor);
  const inventory = useStore((s) => s.inventory);
  const setPanel = useStore((s) => s.setPanel);

  const level = getLevel(xp);
  const now = Date.now();
  const season = getCurrentSeason(now, seasonAnchor);

  const setState = (patch: any) => useStore.setState(patch as any);

  const giveCoins = (n: number) =>
    setState({ coins: parseFloat(((coins ?? 0) + n).toFixed(4)) });

  const giveGems = (n: number) => setState({ gems: (gems ?? 0) + n });

  const giveXp = (n: number) => setState({ xp: (xp ?? 0) + n });

  const setLevel = (lvl: number) => {
    const xp = LEVEL_EXPERIENCE[Math.min(lvl, LEVEL_EXPERIENCE.length - 1)] ?? 0;
    setState({ xp });
  };

  const giveAllSeeds = (qty: number) => {
    const inv: Record<string, number> = { ...inventory };
    for (const c of CROPS) inv[`${c.id}_seed`] = (inv[`${c.id}_seed`] ?? 0) + qty;
    setState({ inventory: inv });
  };

  const giveAllResources = (qty: number) => {
    const inv: Record<string, number> = { ...inventory };
    for (const r of RESOURCES) inv[r] = (inv[r] ?? 0) + qty;
    setState({ inventory: inv });
  };

  const giveAllTools = (qty: number) => {
    const inv: Record<string, number> = { ...inventory };
    for (const t of TOOLS) inv[t.id] = (inv[t.id] ?? 0) + qty;
    setState({ inventory: inv });
  };

  const setIsland = (id: IslandId) => setState({ island: id });

  const setSeason = (s: Season) => {
    // Anchor so that current time falls inside the requested season
    const idx = SEASON_ORDER.indexOf(s);
    const anchor = now - idx * SEASON_DURATION_MS;
    setState({ seasonAnchor: anchor });
  };

  const skipCooldowns = () => {
    const cells = { ...useStore.getState().cells };
    for (const k of Object.keys(cells)) {
      const c = cells[k];
      if ("lastHarvest" in c) cells[k] = { ...c, lastHarvest: 0, currentHits: 0, lastHitAt: 0 };
      if (c.plantedAt) cells[k] = { ...c, plantedAt: 1 };
    }
    setState({ cells });
  };

  const resetSave = () => {
    if (confirm("Удалить ВСЁ сохранение и начать заново?")) {
      localStorage.removeItem("near-farm-v2");
      location.reload();
    }
  };

  const Btn = ({ onClick, children, className = "" }: any) => (
    <button onClick={onClick}
      className={`font-game text-[8px] px-2 py-1 border border-black bg-brown-700 text-yellow-200 hover:bg-brown-600 active:bg-brown-800 ${className}`}>
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPanel(null)}>
      <div className="bg-brown-800 border-2 border-yellow-600 p-3 max-w-[440px] w-full max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-game text-[12px] text-yellow-300">🛠 DEV PANEL</h2>
          <button className="font-game text-[10px] text-red-400" onClick={() => setPanel(null)}>✕</button>
        </div>

        <div className="font-game text-[7px] text-white/70 mb-3">
          Lv {level} · XP {xp.toFixed(0)} · 🪙 {coins.toFixed(2)} · 💎 {gems} · 🏝 {island} · 🌸 {season}
        </div>

        <div className="grid grid-cols-2 gap-1 mb-3">
          <Btn onClick={() => giveCoins(1000)}>+1000 🪙</Btn>
          <Btn onClick={() => giveCoins(100000)}>+100k 🪙</Btn>
          <Btn onClick={() => giveGems(50)}>+50 💎</Btn>
          <Btn onClick={() => giveXp(1000)}>+1000 XP</Btn>
        </div>

        <div className="font-game text-[8px] text-yellow-300 mb-1">Уровень</div>
        <div className="grid grid-cols-5 gap-1 mb-3">
          {[1, 5, 10, 15, 20, 25, 30, 35, 40, 50].map((l) => (
            <Btn key={l} onClick={() => setLevel(l)}>Lv{l}</Btn>
          ))}
        </div>

        <div className="font-game text-[8px] text-yellow-300 mb-1">Инвентарь</div>
        <div className="grid grid-cols-2 gap-1 mb-3">
          <Btn onClick={() => giveAllSeeds(50)}>+50 каждого семени</Btn>
          <Btn onClick={() => giveAllResources(100)}>+100 каждого ресурса</Btn>
          <Btn onClick={() => giveAllTools(5)}>+5 каждого инструмента</Btn>
          <Btn onClick={skipCooldowns}>Пропустить кулдауны</Btn>
        </div>

        <div className="font-game text-[8px] text-yellow-300 mb-1">Остров</div>
        <div className="grid grid-cols-4 gap-1 mb-3">
          {(["basic", "spring", "desert", "volcano"] as IslandId[]).map((isl) => (
            <Btn key={isl} className={island === isl ? "!bg-yellow-700" : ""} onClick={() => setIsland(isl)}>{isl}</Btn>
          ))}
        </div>

        <div className="font-game text-[8px] text-yellow-300 mb-1">Сезон</div>
        <div className="grid grid-cols-4 gap-1 mb-3">
          {(SEASON_ORDER).map((s) => (
            <Btn key={s} className={season === s ? "!bg-yellow-700" : ""} onClick={() => setSeason(s)}>
              {SEASON_INFO[s].emoji} {SEASON_INFO[s].name}
            </Btn>
          ))}
        </div>

        <div className="font-game text-[8px] text-yellow-300 mb-1">Опасное</div>
        <div className="grid grid-cols-1 gap-1">
          <Btn className="!bg-red-900 !text-red-200" onClick={resetSave}>СБРОС САВА</Btn>
        </div>
      </div>
    </div>
  );
}
