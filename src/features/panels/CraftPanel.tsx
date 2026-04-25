import { useStore } from "../../state/store";
import { TOOLS } from "../../data/tools.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

export function CraftPanel() {
  const inventory = useStore((s) => s.inventory);
  const coins = useStore((s) => s.coins);
  const craftTool = useStore((s) => s.craftTool);

  return (
    <PanelShell title="Инструменты">
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
                  <div className="font-game text-[6px] text-white/60">
                    Для: {tool.forResource}
                  </div>
                  {/* Cost breakdown */}
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
                  Создать
                </PixelButton>
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}
