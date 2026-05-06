import { useStore } from "../../state/store";

/**
 * Floating button to enter pollen-boost mode.
 * Топап делается через «+» рядом с балансом пыльцы в HUD (не дублируем здесь).
 */
export function PollenBoostButton() {
  const pollenBoostMode = useStore((s) => s.pollenBoostMode);
  const togglePollenBoost = useStore((s) => s.togglePollenBoost);
  const pollen = useStore((s) => s.pollen ?? 0);

  return (
    <div className="absolute pointer-events-auto" style={{ top: 84, left: 8, zIndex: 30 }}>
      <button
        onClick={togglePollenBoost}
        title={pollenBoostMode
          ? "Выключить режим удобрения"
          : "Удобрить пыльцой: грядка 1 / клумба 5 / фрукт. куст 10. ×2 урожай (одноразово)"}
        className={`relative font-game text-[8px] px-2 py-1 border whitespace-nowrap ${
          pollenBoostMode
            ? "border-yellow-400 bg-yellow-700 text-black"
            : "border-black bg-amber-700 text-yellow-200 hover:bg-amber-600"
        }`}
      >
        🌼 Удобрить · {pollen.toFixed(2)}
      </button>
    </div>
  );
}
