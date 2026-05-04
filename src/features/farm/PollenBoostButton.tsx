import { useStore } from "../../state/store";

/** Floating button to enter pollen-boost mode. Shows current pollen count. */
export function PollenBoostButton() {
  const pollenBoostMode = useStore((s) => s.pollenBoostMode);
  const togglePollenBoost = useStore((s) => s.togglePollenBoost);
  const pollen = useStore((s) => s.pollen ?? 0);

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ top: 84, left: 8, zIndex: 30 }}
    >
      <button
        onClick={togglePollenBoost}
        title={pollenBoostMode ? "Выключить режим удобрения" : "Удобрить грядку/клумбу/фрукт. Цена: грядка 1 / клумба 5 / фрукт 10. ×2 урожая на 12 ч (прорейт)"}
        className={`relative font-game text-[8px] px-2 py-1 border whitespace-nowrap ${pollenBoostMode ? "border-yellow-400 bg-yellow-700 text-black animate-pulse" : "border-black bg-amber-700 text-yellow-200 hover:bg-amber-600"}`}
      >
        🌼 Удобрить · {pollen.toFixed(0)}
      </button>
    </div>
  );
}
