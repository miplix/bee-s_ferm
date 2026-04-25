import { useStore } from "../../state/store";
import { getAnimalLevel, ANIMAL_CAPACITY } from "../../data/animals.data";
import { getUpgradeDef } from "../../data/buildings.data";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";

export function HenhouseScreen() {
  useTick(1000);
  const animals = useStore((s) => s.animals);
  const inventory = useStore((s) => s.inventory);
  const setLocation = useStore((s) => s.setLocation);
  const buyAnimal = useStore((s) => s.buyAnimal);
  const feedAnimal = useStore((s) => s.feedAnimal);
  const collectAnimal = useStore((s) => s.collectAnimal);
  const cureAnimal = useStore((s) => s.cureAnimal);
  const sellAnimal = useStore((s) => s.sellAnimal);
  const upgradeBuildingAction = useStore((s) => s.upgradeBuilding);
  const buildingLevels = useStore((s) => s.buildingLevels);
  const coins = useStore((s) => s.coins);

  const chickens = animals.filter((a) => a.kind === "chicken");
  const henhouseLevel = buildingLevels?.henhouse ?? 1;
  const capacity = ANIMAL_CAPACITY(henhouseLevel);
  const now = Date.now();
  const wheat = inventory.wheat ?? 0;

  return (
    <div className="flex-1 overflow-auto bg-[#3a2a15] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐔</span>
          <span className="font-game text-[12px] text-yellow-300">
            Курятник Ур.{henhouseLevel} ({chickens.length}/{capacity})
          </span>
        </div>
        <button
          onClick={() => setLocation("farm")}
          className="font-game text-[8px] text-yellow-300 underline"
        >
          ← На ферму
        </button>
      </div>

      {/* Feed info */}
      <div className="mb-3 font-game text-[7px] text-white/60">
        Пшеница: {wheat} | Корм: пшеница
      </div>

      {/* Buy button */}
      <div className="mb-4">
        <PixelButton
          disabled={chickens.length >= capacity || coins < 50}
          onClick={() => buyAnimal("chicken")}
        >
          Купить курицу (50м)
        </PixelButton>
      </div>

      {/* Upgrade button */}
      {(() => {
        const upgrade = getUpgradeDef("henhouse", henhouseLevel);
        if (!upgrade) return null;
        const canUpgrade = Object.entries(upgrade.cost).every(([res, needed]) =>
          res === "coins" ? coins >= needed : (inventory[res] ?? 0) >= needed
        );
        return (
          <div className="mb-4">
            <PixelButton
              disabled={!canUpgrade}
              onClick={() => upgradeBuildingAction("henhouse")}
            >
              Улучшить до Ур.{upgrade.toLevel} (
              {Object.entries(upgrade.cost)
                .map(([r, n]) => `${n} ${r}`)
                .join(", ")}
              )
            </PixelButton>
          </div>
        );
      })()}

      {/* Chicken list */}
      <div className="space-y-2">
        {chickens.map((chicken) => {
          const lvl = getAnimalLevel("chicken", chicken.xp);
          const producing = chicken.lastFed > 0;
          const ready = producing && isReady(chicken.lastFed, lvl.productionMs, now);
          const prog = producing ? calcProgress(chicken.lastFed, lvl.productionMs, now) : 0;
          const rem = producing ? remaining(chicken.lastFed, lvl.productionMs, now) : 0;
          const canFeed = !producing && wheat >= lvl.feedCost;

          return (
            <div
              key={chicken.id}
              className={`p-2 border border-black/30 ${chicken.diseased ? "bg-red-900/40" : "bg-brown-600"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{chicken.diseased ? "🤒" : "🐔"}</span>
                <div className="flex-1">
                  <div className="font-game text-[8px] text-white">
                    Ур.{lvl.level} | XP: {chicken.xp}
                  </div>
                  <div className="font-game text-[6px] text-white/50">
                    Даёт: {lvl.amount} {lvl.product} | Корм: {lvl.feedCost} пшеницы
                  </div>
                </div>

                {chicken.diseased && (
                  <PixelButton variant="danger" onClick={() => cureAnimal(chicken.id)}>
                    Лечить
                  </PixelButton>
                )}
                {!producing && !ready && (
                  <PixelButton disabled={!canFeed} onClick={() => feedAnimal(chicken.id)}>
                    Кормить
                  </PixelButton>
                )}
                {ready && (
                  <PixelButton onClick={() => collectAnimal(chicken.id)}>
                    Собрать
                  </PixelButton>
                )}
                <PixelButton variant="danger" onClick={() => sellAnimal(chicken.id)}>
                  Продать
                </PixelButton>
              </div>

              {producing && !ready && (
                <div className="mt-1">
                  <Progress value={prog} color="bg-orange-400" />
                  <div className="font-game text-[6px] text-yellow-300 mt-0.5">
                    {fmtDuration(rem)}
                  </div>
                </div>
              )}
              {ready && (
                <div className="font-game text-[7px] text-green-400 mt-1">
                  Готово!
                </div>
              )}
            </div>
          );
        })}

        {chickens.length === 0 && (
          <p className="font-game text-[8px] text-white/50">Нет кур. Купите первую!</p>
        )}
      </div>
    </div>
  );
}
