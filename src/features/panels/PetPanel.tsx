import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { PETS } from "../../data/pets.data";

export function PetPanel() {
  const pets = useStore((s) => s.pets);
  const adoptPet = useStore((s) => s.adoptPet);

  return (
    <PanelShell title="Pets">
      <div className="space-y-2">
        {PETS.map((p) => {
          const owned = pets.includes(p.id);
          return (
            <div
              key={p.id}
              className={`p-2 border border-black/20 rounded
                ${owned ? "bg-green-800/60 border-green-500/40" : "bg-brown-600"}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-game text-[8px] text-white truncate">
                      {p.name}
                    </span>
                    {owned && (
                      <span className="font-game text-[6px] text-green-400 shrink-0">
                        Owned
                      </span>
                    )}
                  </div>
                  <p className="font-game text-[6px] text-white/60 mt-0.5">
                    {formatBoost(p.boost)}
                  </p>
                  <p className="font-game text-[5px] text-white/40 mt-0.5">
                    From: {p.obtainedFrom}
                  </p>
                </div>
                {!owned && (
                  <PixelButton
                    variant="primary"
                    onClick={() => adoptPet(p.id)}
                    className="shrink-0 !text-[7px] !px-2 !py-1"
                  >
                    Adopt
                  </PixelButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function formatBoost(boost: { type: string; target: string; value: number }): string {
  const pct = Math.round(Math.abs(boost.value) * 100);
  const sign = boost.value >= 0 ? "+" : "-";
  const target = boost.target.replace(/_/g, " ");
  return `${sign}${pct}% ${target}`;
}
