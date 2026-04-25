import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { remaining, fmtDuration, isReady } from "../../domain/time/time";
import {
  PETS,
  getPetLevel,
  getPetLevelProgress,
  PET_NAP_COOLDOWN_MS,
  PET_FEED_COST,
} from "../../data/pets.data";

export function PetPanel() {
  useTick(1000);
  const pets = useStore((s) => s.pets);
  const petStates = useStore((s) => s.petStates);
  const buildings = useStore((s) => s.buildings);
  const inventory = useStore((s) => s.inventory);
  const adoptPet = useStore((s) => s.adoptPet);
  const napPet = useStore((s) => s.napPet);
  const feedPet = useStore((s) => s.feedPet);

  const hasPetHouse = buildings.includes("pet_house" as any);
  const now = Date.now();
  const feedItem = Object.keys(PET_FEED_COST)[0] ?? "wheat";
  const feedQty = PET_FEED_COST[feedItem] ?? 1;
  const canFeed = (inventory[feedItem] ?? 0) >= feedQty;

  return (
    <PanelShell title="Питомцы">
      <div className="space-y-2">
        {!hasPetHouse && (
          <p className="font-game text-[7px] text-yellow-400/80">
            Постройте Pet House (Lv15) чтобы завести питомцев.
          </p>
        )}

        {PETS.map((p) => {
          const owned = pets.includes(p.id);
          const ps = petStates[p.id];
          const lvDef = ps ? getPetLevel(ps.xp) : null;
          const lvProgress = ps ? getPetLevelProgress(ps.xp) : 0;
          const napReady = ps ? isReady(ps.lastNap, PET_NAP_COOLDOWN_MS, now) : false;
          const napRem = ps ? remaining(ps.lastNap, PET_NAP_COOLDOWN_MS, now) : 0;

          return (
            <div
              key={p.id}
              className={`p-2 border border-black/20 ${owned ? "bg-green-900/50 border-green-600/30" : "bg-brown-600"}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base leading-none mt-0.5">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-game text-[8px] text-white">{p.name}</span>
                    {owned && lvDef && (
                      <span className="font-game text-[6px] text-yellow-300">Lv{lvDef.level}</span>
                    )}
                  </div>
                  <p className="font-game text-[6px] text-white/60">{formatBoost(p.boost)}</p>

                  {owned && ps && (
                    <div className="mt-1 space-y-0.5">
                      <Progress value={lvProgress} color="bg-purple-400" />
                      <p className="font-game text-[5px] text-white/40">
                        XP {ps.xp} · Boost ×{lvDef?.boostMultiplier.toFixed(2)}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <PixelButton
                          disabled={!napReady}
                          onClick={() => napPet(p.id)}
                        >
                          {napReady ? "Поспать" : fmtDuration(napRem)}
                        </PixelButton>
                        <PixelButton
                          variant="secondary"
                          disabled={!canFeed}
                          onClick={() => feedPet(p.id)}
                        >
                          Кормить ({feedQty} {feedItem})
                        </PixelButton>
                      </div>
                    </div>
                  )}
                </div>

                {!owned && hasPetHouse && (
                  <PixelButton
                    variant="primary"
                    onClick={() => adoptPet(p.id)}
                    className="shrink-0 !text-[7px] !px-2 !py-1"
                  >
                    Взять
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
  return `${sign}${pct}% ${boost.target.replace(/_/g, " ")}`;
}
