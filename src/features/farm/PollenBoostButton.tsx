import { useStore } from "../../state/store";
import { useT } from "../../i18n/useT";

/**
 * Floating button to enter pollen-boost mode.
 * Топап делается через «+» рядом с балансом пыльцы в HUD (не дублируем здесь).
 */
export function PollenBoostButton() {
  const t = useT();
  const pollenBoostMode = useStore((s) => s.pollenBoostMode);
  const togglePollenBoost = useStore((s) => s.togglePollenBoost);
  const pollen = useStore((s) => s.pollen ?? 0);

  return (
    <div className="absolute pointer-events-auto" style={{ top: 84, left: 8, zIndex: 30 }}>
      <button
        onClick={togglePollenBoost}
        title={pollenBoostMode ? t("boost.title.on") : t("boost.title.off")}
        className={`relative font-game text-[8px] px-2 py-1 border whitespace-nowrap ${
          pollenBoostMode
            ? "border-yellow-400 bg-yellow-700 text-black"
            : "border-black bg-amber-700 text-yellow-200 hover:bg-amber-600"
        }`}
      >
        {t("boost.label", { n: pollen.toFixed(2) })}
      </button>
    </div>
  );
}
