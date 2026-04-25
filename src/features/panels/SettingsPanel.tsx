import { useState } from "react";
import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

export function SettingsPanel() {
  const [confirmReset, setConfirmReset] = useState(false);
  const resetGame = useStore((s) => s.resetGame);
  const setPanel = useStore((s) => s.setPanel);
  const island = useStore((s) => s.island);
  const expansion = useStore((s) => s.expansion);
  const xp = useStore((s) => s.xp);
  const coins = useStore((s) => s.coins);

  const islandLabels: Record<string, string> = {
    basic: "Основной",
    spring: "Весенний",
    desert: "Пустынный",
    volcano: "Вулканический",
  };

  function handleReset() {
    resetGame();
    setPanel(null);
    setConfirmReset(false);
  }

  return (
    <PanelShell title="Настройки">
      <div className="space-y-3">
        {/* Game info */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">Состояние</p>
          <div className="font-game text-[7px] text-white/80 space-y-0.5">
            <p>Остров: {islandLabels[island] ?? island}</p>
            <p>Расширений: {expansion}</p>
            <p>XP: {Math.floor(xp)}</p>
            <p>Монет: {coins.toFixed(2)}</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <p className="font-game text-[8px] text-yellow-300">О игре</p>
          <p className="font-game text-[7px] text-white/60 mt-0.5">
            Пчело-ферма v0.1 — NEAR Blockchain Farm
          </p>
        </div>

        {/* Reset */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <p className="font-game text-[8px] text-yellow-300 mb-2">Сброс прогресса</p>
          {!confirmReset ? (
            <PixelButton variant="secondary" onClick={() => setConfirmReset(true)}>
              Сбросить игру
            </PixelButton>
          ) : (
            <div className="space-y-2">
              <p className="font-game text-[7px] text-red-400">
                Это удалит весь прогресс! Уверены?
              </p>
              <div className="flex gap-2">
                <PixelButton onClick={handleReset}>
                  Да, сброс
                </PixelButton>
                <PixelButton variant="secondary" onClick={() => setConfirmReset(false)}>
                  Отмена
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelShell>
  );
}
