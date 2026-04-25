import { useStore } from "../../state/store";
import { getAnimalLevel, ANIMAL_CAPACITY } from "../../data/animals.data";
import { getUpgradeDef } from "../../data/buildings.data";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";
import type { AnimalKind } from "../../domain/types/ids";
import type { AnimalState } from "../../domain/types/game";

function AnimalCard({
  animal,
  kind,
  emoji,
  wheat,
  now,
  feedAnimal,
  collectAnimal,
  sellAnimal,
}: {
  animal: AnimalState;
  kind: AnimalKind;
  emoji: string;
  wheat: number;
  now: number;
  feedAnimal: (id: string) => void;
  collectAnimal: (id: string) => void;
  sellAnimal: (id: string) => void;
}) {
  const lvl = getAnimalLevel(kind, animal.xp);
  const producing = animal.lastFed > 0;
  const ready = producing && isReady(animal.lastFed, lvl.productionMs, now);
  const prog = producing ? calcProgress(animal.lastFed, lvl.productionMs, now) : 0;
  const rem = producing ? remaining(animal.lastFed, lvl.productionMs, now) : 0;
  const canFeed = !producing && wheat >= lvl.feedCost;

  return (
    <div key={animal.id} className="p-2 border border-black/30 bg-brown-600">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{emoji}</span>
        <div className="flex-1">
          <div className="font-game text-[8px] text-white">
            Ур.{lvl.level} | XP: {animal.xp}
          </div>
          <div className="font-game text-[6px] text-white/50">
            Даёт: {lvl.amount} {lvl.product} | Корм: {lvl.feedCost} пшеницы
          </div>
        </div>

        {!producing && !ready && (
          <PixelButton disabled={!canFeed} onClick={() => feedAnimal(animal.id)}>
            Кормить
          </PixelButton>
        )}
        {ready && (
          <PixelButton onClick={() => collectAnimal(animal.id)}>
            Собрать
          </PixelButton>
        )}
        <PixelButton variant="danger" onClick={() => sellAnimal(animal.id)}>
          Продать
        </PixelButton>
      </div>

      {producing && !ready && (
        <div className="mt-1">
          <Progress value={prog} color="bg-blue-400" />
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
}

export function BarnScreen() {
  useTick(1000);
  const animals = useStore((s) => s.animals);
  const inventory = useStore((s) => s.inventory);
  const buildingLevels = useStore((s) => s.buildingLevels);
  const setLocation = useStore((s) => s.setLocation);
  const buyAnimal = useStore((s) => s.buyAnimal);
  const feedAnimal = useStore((s) => s.feedAnimal);
  const collectAnimal = useStore((s) => s.collectAnimal);
  const sellAnimal = useStore((s) => s.sellAnimal);
  const upgradeBuildingAction = useStore((s) => s.upgradeBuilding);
  const coins = useStore((s) => s.coins);

  const cows = animals.filter((a) => a.kind === "cow");
  const sheep = animals.filter((a) => a.kind === "sheep");
  const barnLevel = buildingLevels?.barn ?? 1;
  const capacity = ANIMAL_CAPACITY(barnLevel);
  const totalAnimals = cows.length + sheep.length;
  const now = Date.now();
  const wheat = inventory.wheat ?? 0;

  const upgrade = getUpgradeDef("barn", barnLevel);
  const canUpgrade = upgrade
    ? Object.entries(upgrade.cost).every(([res, needed]) =>
        res === "coins" ? coins >= needed : (inventory[res] ?? 0) >= needed
      )
    : false;

  return (
    <div className="flex-1 overflow-auto bg-[#3a2a15] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <span className="font-game text-[12px] text-yellow-300">
            Амбар Ур.{barnLevel} ({totalAnimals}/{capacity})
          </span>
        </div>
        <button
          onClick={() => setLocation("farm")}
          className="font-game text-[8px] text-yellow-300 underline"
        >
          ← На ферму
        </button>
      </div>

      <div className="mb-3 font-game text-[7px] text-white/60">
        Пшеница: {wheat}
      </div>

      {/* Buy buttons */}
      <div className="flex gap-2 mb-4">
        <PixelButton
          disabled={totalAnimals >= capacity || coins < 200}
          onClick={() => buyAnimal("cow")}
        >
          Купить корову (200м)
        </PixelButton>
        <PixelButton
          disabled={totalAnimals >= capacity || coins < 120}
          onClick={() => buyAnimal("sheep")}
        >
          Купить овцу (120м)
        </PixelButton>
      </div>

      {/* Upgrade button */}
      {upgrade && (
        <div className="mb-4">
          <PixelButton
            disabled={!canUpgrade}
            onClick={() => upgradeBuildingAction("barn")}
          >
            Улучшить до Ур.{upgrade.toLevel} (
            {Object.entries(upgrade.cost)
              .map(([r, n]) => `${n} ${r}`)
              .join(", ")}
            )
          </PixelButton>
        </div>
      )}

      {/* Cows section */}
      {cows.length > 0 && (
        <div className="mb-3">
          <div className="font-game text-[9px] text-yellow-300 mb-1">Коровы</div>
          <div className="space-y-2">
            {cows.map((cow) => (
              <AnimalCard
                key={cow.id}
                animal={cow}
                kind="cow"
                emoji="🐄"
                wheat={wheat}
                now={now}
                feedAnimal={feedAnimal}
                collectAnimal={collectAnimal}
                sellAnimal={sellAnimal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sheep section */}
      {sheep.length > 0 && (
        <div className="mb-3">
          <div className="font-game text-[9px] text-yellow-300 mb-1">Овцы</div>
          <div className="space-y-2">
            {sheep.map((s) => (
              <AnimalCard
                key={s.id}
                animal={s}
                kind="sheep"
                emoji="🐑"
                wheat={wheat}
                now={now}
                feedAnimal={feedAnimal}
                collectAnimal={collectAnimal}
                sellAnimal={sellAnimal}
              />
            ))}
          </div>
        </div>
      )}

      {totalAnimals === 0 && (
        <p className="font-game text-[8px] text-white/50">Нет животных. Купите корову или овцу!</p>
      )}
    </div>
  );
}
