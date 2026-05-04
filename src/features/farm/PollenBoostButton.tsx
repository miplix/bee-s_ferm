import { useState } from "react";
import { useStore } from "../../state/store";
import { PollenTopupModal } from "../near/PollenTopupModal";
import { getAccount } from "../../lib/near/wallet";

/** Floating button to enter pollen-boost mode. Shows current pollen count. */
export function PollenBoostButton() {
  const pollenBoostMode = useStore((s) => s.pollenBoostMode);
  const togglePollenBoost = useStore((s) => s.togglePollenBoost);
  const pollen = useStore((s) => s.pollen ?? 0);
  const [showTopup, setShowTopup] = useState(false);

  return (
    <>
      <div className="absolute pointer-events-auto flex flex-col gap-1" style={{ top: 84, left: 8, zIndex: 30 }}>
        <button
          onClick={togglePollenBoost}
          title={pollenBoostMode ? "Выключить режим удобрения" : "Удобрить грядку/клумбу/фрукт. Цена: грядка 1 / клумба 5 / фрукт 10. ×2 урожая на 12 ч"}
          className={`relative font-game text-[8px] px-2 py-1 border whitespace-nowrap ${pollenBoostMode ? "border-yellow-400 bg-yellow-700 text-black animate-pulse" : "border-black bg-amber-700 text-yellow-200 hover:bg-amber-600"}`}
        >
          🌼 Удобрить · {pollen.toFixed(0)}
        </button>
        <button
          onClick={() => {
            if (!getAccount()) { alert("Подключи NEAR-кошелёк"); return; }
            setShowTopup(true);
          }}
          title="Купить пыльцу за NEAR (1:1)"
          className="font-game text-[7px] px-2 py-1 border border-black bg-purple-800 text-purple-200 hover:bg-purple-700 whitespace-nowrap"
        >
          + NEAR
        </button>
      </div>
      {showTopup && <PollenTopupModal onClose={() => setShowTopup(false)} />}
    </>
  );
}
