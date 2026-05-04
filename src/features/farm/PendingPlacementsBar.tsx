import { useStore } from "../../state/store";

const LABELS: Record<string, { emoji: string; ru: string }> = {
  tree: { emoji: "🌳", ru: "Дерево" },
  fruit_patch: { emoji: "🍎", ru: "Фруктовая грядка" },
  greenhouse: { emoji: "🌿", ru: "Теплица" },
  plot: { emoji: "🟫", ru: "Грядка" },
  flower_bed: { emoji: "🌸", ru: "Клумба" },
  rock: { emoji: "🪨", ru: "Камень" },
  iron: { emoji: "⛏️", ru: "Железо" },
  gold: { emoji: "✨", ru: "Золото" },
  crimstone: { emoji: "🔴", ru: "Кримстоун" },
  oil_reserve: { emoji: "🛢️", ru: "Нефть" },
  obsidian_rock: { emoji: "⬛", ru: "Обсидиан" },
  sunstone_rock: { emoji: "🟡", ru: "Санстоун" },
  lava_pit: { emoji: "🌋", ru: "Лавовая яма" },
};

/** Small bar at top showing pending overflow items + click-to-place button. */
export function PendingPlacementsBar() {
  const pending = useStore((s) => s.pendingPlacements ?? {});
  const placementType = useStore((s) => s.placementType);
  const startPlacement = useStore((s) => s.startPlacement);
  const cancelPlacement = useStore((s) => s.cancelPlacement);

  const entries = Object.entries(pending).filter(([, n]) => n > 0);
  if (entries.length === 0 && !placementType) return null;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ top: 70, left: 8, zIndex: 35 }}
    >
      <div className="bg-brown-800/90 border border-yellow-600/60 p-2 max-w-[180px] shadow-lg">
        <div className="font-game text-[7px] text-yellow-300 mb-1">
          На размещение:
        </div>
        <div className="grid grid-cols-3 gap-1">
          {entries.map(([type, n]) => {
            const lbl = LABELS[type] ?? { emoji: "❓", ru: type };
            const active = placementType === type;
            return (
              <button
                key={type}
                onClick={() => active ? cancelPlacement() : startPlacement(type)}
                title={`${lbl.ru} × ${n}`}
                className={`relative flex items-center justify-center text-[18px] border ${active ? "border-yellow-400 bg-yellow-700/40" : "border-black/30 bg-brown-700"} hover:bg-brown-600 cursor-pointer`}
                style={{ width: 36, height: 36 }}
              >
                {lbl.emoji}
                <span className="absolute bottom-0 right-0 text-[7px] font-game text-yellow-200 bg-black/50 px-0.5">
                  {n}
                </span>
              </button>
            );
          })}
        </div>
        {placementType && (
          <div className="font-game text-[6px] text-green-300 mt-1">
            Кликни пустую клетку
            <button onClick={cancelPlacement} className="ml-1 text-red-300 underline">отмена</button>
          </div>
        )}
      </div>
    </div>
  );
}
