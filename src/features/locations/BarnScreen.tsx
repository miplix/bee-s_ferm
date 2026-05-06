import { useStore } from "../../state/store";
import { getAnimalLevel, ANIMAL_CAPACITY } from "../../data/animals.data";
import { getUpgradeDef } from "../../data/buildings.data";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";
import type { AnimalKind } from "../../domain/types/ids";
import type { AnimalState } from "../../domain/types/game";
import { useT } from "../../i18n/useT";
import { getItemName } from "../../i18n/itemNames";
import type { Language } from "../../i18n/types";

function AnimalCard({
  animal, kind, emoji, wheat, now, feedAnimal, collectAnimal, sellAnimal, lang,
}: {
  animal: AnimalState; kind: AnimalKind; emoji: string;
  wheat: number; now: number;
  feedAnimal: (id: string) => void;
  collectAnimal: (id: string) => void;
  sellAnimal: (id: string) => void;
  lang: Language;
}) {
  const t = useT();
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
            {t("loc.lvl_xp", { n: lvl.level, xp: animal.xp })}
          </div>
          <div className="font-game text-[6px] text-white/50">
            {t("loc.gives", { n: lvl.amount, item: getItemName(lvl.product, lang), feed: `${lvl.feedCost} ${getItemName("wheat", lang)}` })}
          </div>
        </div>

        {!producing && !ready && (
          <PixelButton disabled={!canFeed} onClick={() => feedAnimal(animal.id)}>
            {t("loc.feed_btn")}
          </PixelButton>
        )}
        {ready && (
          <PixelButton onClick={() => collectAnimal(animal.id)}>
            {t("loc.collect")}
          </PixelButton>
        )}
        <PixelButton variant="danger" onClick={() => sellAnimal(animal.id)}>
          {t("loc.sell")}
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
          {t("loc.ready")}
        </div>
      )}
    </div>
  );
}

export function BarnScreen() {
  const t = useT();
  const lang = useStore((s) => (s as any).language as Language) ?? "ru";
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
            {t("loc.barn_title", { n: barnLevel, cur: totalAnimals, max: capacity })}
          </span>
        </div>
        <button
          onClick={() => setLocation("farm")}
          className="font-game text-[8px] text-yellow-300 underline"
        >
          {t("loc.back_to_farm")}
        </button>
      </div>

      <div className="mb-3 font-game text-[7px] text-white/60">
        {t("loc.wheat_only", { n: wheat })}
      </div>

      <div className="flex gap-2 mb-4">
        <PixelButton
          disabled={totalAnimals >= capacity || coins < 200}
          onClick={() => buyAnimal("cow")}
        >
          {t("loc.buy_cow")}
        </PixelButton>
        <PixelButton
          disabled={totalAnimals >= capacity || coins < 120}
          onClick={() => buyAnimal("sheep")}
        >
          {t("loc.buy_sheep")}
        </PixelButton>
      </div>

      {upgrade && (
        <div className="mb-4">
          <PixelButton disabled={!canUpgrade} onClick={() => upgradeBuildingAction("barn")}>
            {t("loc.upgrade_to", {
              n: upgrade.toLevel,
              cost: Object.entries(upgrade.cost).map(([r, n]) => `${n} ${getItemName(r, lang)}`).join(", "),
            })}
          </PixelButton>
        </div>
      )}

      {cows.length > 0 && (
        <div className="mb-3">
          <div className="font-game text-[9px] text-yellow-300 mb-1">{t("loc.cows_section")}</div>
          <div className="space-y-2">
            {cows.map((cow) => (
              <AnimalCard key={cow.id} animal={cow} kind="cow" emoji="🐄"
                wheat={wheat} now={now}
                feedAnimal={feedAnimal} collectAnimal={collectAnimal} sellAnimal={sellAnimal}
                lang={lang} />
            ))}
          </div>
        </div>
      )}

      {sheep.length > 0 && (
        <div className="mb-3">
          <div className="font-game text-[9px] text-yellow-300 mb-1">{t("loc.sheep_section")}</div>
          <div className="space-y-2">
            {sheep.map((sh) => (
              <AnimalCard key={sh.id} animal={sh} kind="sheep" emoji="🐑"
                wheat={wheat} now={now}
                feedAnimal={feedAnimal} collectAnimal={collectAnimal} sellAnimal={sellAnimal}
                lang={lang} />
            ))}
          </div>
        </div>
      )}

      {totalAnimals === 0 && (
        <p className="font-game text-[8px] text-white/50">{t("loc.no_animals")}</p>
      )}
    </div>
  );
}
