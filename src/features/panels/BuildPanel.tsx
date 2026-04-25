import { useState } from "react";
import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { BUILDINGS } from "../../data/buildings.data";
import { TOOLS } from "../../data/tools.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

type Tab = "tools" | "buildings";

export function BuildPanel() {
  const [tab, setTab] = useState<Tab>("tools");
  const level = useStore(selectLevel);
  const buildings = useStore((s) => s.buildings);
  const inventory = useStore((s) => s.inventory);
  const coins = useStore((s) => s.coins);
  const craftTool = useStore((s) => s.craftTool);
  const buildAction = useStore((s) => (s as any).build as (id: string) => void);

  return (
    <PanelShell title="Верстак">
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setTab("tools")}
          className={`font-game text-[8px] px-3 py-1 border border-black/30
            ${tab === "tools" ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}
        >
          Инструменты
        </button>
        <button
          onClick={() => setTab("buildings")}
          className={`font-game text-[8px] px-3 py-1 border border-black/30
            ${tab === "buildings" ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}
        >
          Постройки
        </button>
      </div>

      {tab === "tools" && (
        <div className="space-y-2">
          {TOOLS.map((tool) => {
            const canCraft = Object.entries(tool.cost).every(([res, needed]) => {
              if (res === "coins") return coins >= (needed ?? 0) - 0.001;
              return (inventory[res] ?? 0) >= (needed ?? 0);
            });
            const owned = inventory[tool.id] ?? 0;

            return (
              <div key={tool.id} className="bg-brown-600 p-2 border border-black/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tool.emoji}</span>
                  <div className="flex-1">
                    <div className="font-game text-[8px] text-white">{tool.name}</div>
                    <div className="font-game text-[6px] text-white/60">Для: {tool.forResource}</div>
                    <div className="flex flex-wrap gap-x-2 mt-0.5">
                      {Object.entries(tool.cost).map(([res, needed]) => {
                        const have = res === "coins" ? coins : (inventory[res] ?? 0);
                        const ok = res === "coins" ? have >= (needed ?? 0) - 0.001 : have >= (needed ?? 0);
                        return (
                          <span key={res} className={`font-game text-[6px] ${ok ? "text-green-400" : "text-red-400"}`}>
                            {needed} {res} ({Math.floor(have)})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <span className="font-game text-[8px] text-yellow-300 w-6 text-right">{owned}</span>
                  <PixelButton disabled={!canCraft} onClick={() => craftTool(tool.id, 1)}>
                    Сделать
                  </PixelButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "buildings" && (
        <div className="space-y-2">
          {BUILDINGS.filter((b) => !b.starter).map((b) => {
            const built = buildings.includes(b.id);
            const locked = level < b.level;
            const canAfford = !locked && !built && Object.entries(b.cost).every(([res, needed]) => {
              if (res === "coins") return coins >= needed - 0.001;
              return (inventory[res] ?? 0) >= needed;
            });

            return (
              <div key={b.id} className={`bg-brown-600 p-2 border border-black/20 ${locked ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{b.emoji}</span>
                  <div className="flex-1">
                    <div className="font-game text-[8px] text-white flex items-center gap-1">
                      {b.name}
                      {locked && <span className="text-[7px] text-red-400">🔒 Lv.{b.level}</span>}
                      {built && <span className="text-[7px] text-green-400">Built</span>}
                    </div>
                    <div className="font-game text-[6px] text-white/50">{b.desc}</div>
                    {!built && !locked && (
                      <div className="flex flex-wrap gap-x-2 mt-0.5">
                        {Object.entries(b.cost).map(([res, needed]) => {
                          const have = res === "coins" ? coins : (inventory[res] ?? 0);
                          const ok = res === "coins" ? have >= needed - 0.001 : have >= needed;
                          return (
                            <span key={res} className={`font-game text-[6px] ${ok ? "text-green-400" : "text-red-400"}`}>
                              {needed} {res}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {!built && !locked && (
                    <PixelButton disabled={!canAfford} onClick={() => buildAction(b.id)}>
                      Построить
                    </PixelButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
