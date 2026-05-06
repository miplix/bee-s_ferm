import { useState } from "react";
import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { FISH, BAITS, DAILY_CAST_LIMIT } from "../../data/fishing.data";
import { useT } from "../../i18n/useT";

type Tab = "cast" | "sell";

export function FishingPanel() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("cast");
  const [lastCatch, setLastCatch] = useState<string | null>(null);

  const level = useStore(selectLevel);
  const coins = useStore((s) => s.coins);
  const inventory = useStore((s) => s.inventory);
  const fishingState = useStore((s) => s.fishingState);

  const castLine = useStore((s) => s.castLine);
  const buyBait = useStore((s) => s.buyBait);
  const sellFish = useStore((s) => s.sellFish);

  const castsLeft = DAILY_CAST_LIMIT - fishingState.castsToday;
  const hasRod = (inventory["fishing_rod"] ?? 0) >= 1;

  const handleCast = (baitId: string) => {
    const prevInventory = useStore.getState().inventory;
    castLine(baitId);
    const nextInventory = useStore.getState().inventory;

    for (const fish of FISH) {
      const prev = prevInventory[fish.id] ?? 0;
      const next = nextInventory[fish.id] ?? 0;
      if (next > prev) {
        setLastCatch(fish.id);
        return;
      }
    }
  };

  return (
    <PanelShell title={t("fishing.title")}>
      {/* Casts counter */}
      <div className="flex items-center justify-between mb-2 p-2 bg-brown-800 border border-black/30">
        <span className="font-game text-[8px] text-white">
          {t("fishing.casts_count", { n: fishingState.castsToday, max: DAILY_CAST_LIMIT })}
        </span>
        <span className="font-game text-[7px] text-white/50">
          {t("fishing.left", { n: castsLeft })}
        </span>
      </div>

      {/* Rod status */}
      {!hasRod && (
        <div className="mb-2 p-2 bg-red-900/40 border border-red-500/30">
          <span className="font-game text-[7px] text-red-300">
            {t("fishing.no_rod")}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        <button onClick={() => setTab("cast")}
          className={`font-game text-[8px] px-3 py-1 border border-black/30
            ${tab === "cast" ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}>
          {t("fishing.tab.cast")}
        </button>
        <button onClick={() => setTab("sell")}
          className={`font-game text-[8px] px-3 py-1 border border-black/30
            ${tab === "sell" ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}>
          {t("fishing.tab.sell")}
        </button>
      </div>

      {tab === "cast" && (
        <div className="space-y-2">
          {/* Last catch */}
          {lastCatch && (() => {
            const fish = FISH.find((f) => f.id === lastCatch);
            if (!fish) return null;
            return (
              <div className="p-2 bg-green-900/40 border border-green-500/30 text-center">
                <div className="font-game text-[9px] text-green-300">{t("fishing.caught")}</div>
                <div className="text-lg">{fish.emoji}</div>
                <div className="font-game text-[8px] text-white">{fish.name}</div>
                <div className="font-game text-[6px] text-yellow-300">+{fish.xp} XP</div>
              </div>
            );
          })()}

          {/* Bait list */}
          <h4 className="font-game text-[7px] text-yellow-300">{t("fishing.bait")}</h4>
          {BAITS.map((bait) => {
            const owned = inventory[bait.id] ?? 0;
            const canCast = hasRod && owned > 0 && castsLeft > 0;
            const canBuy = bait.price === 0 || coins >= bait.price;

            return (
              <div key={bait.id}
                className="flex items-center gap-2 p-1.5 border border-black/20 bg-brown-600">
                <span className="text-sm">{bait.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate">
                    {bait.name}
                  </div>
                  <div className="font-game text-[6px] text-white/50">
                    {bait.price > 0 ? `${bait.price.toFixed(0)}м` : t("fishing.bait_free")} | {t("fishing.bait_have", { n: owned })}
                  </div>
                </div>
                <PixelButton variant="secondary" disabled={!canBuy}
                  onClick={() => buyBait(bait.id, 1)}>
                  {t("fishing.btn.buy")}
                </PixelButton>
                <PixelButton disabled={!canCast}
                  onClick={() => handleCast(bait.id)}>
                  {t("fishing.cast")}
                </PixelButton>
              </div>
            );
          })}

          {/* Fish catalog */}
          <h4 className="font-game text-[7px] text-yellow-300 mt-2">{t("fishing.fish_list", { n: level })}</h4>
          {FISH.map((fish) => {
            const locked = fish.minLevel > level;
            const owned = inventory[fish.id] ?? 0;

            return (
              <div key={fish.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${locked ? "bg-brown-600/50 opacity-60" : "bg-brown-600"}`}>
                <span className="text-sm">{fish.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate flex items-center gap-1">
                    {fish.name}
                    <span className={`text-[6px] ${
                      fish.rarity === "rare" ? "text-purple-300" :
                      fish.rarity === "uncommon" ? "text-blue-300" :
                      "text-gray-300"
                    }`}>
                      ({t(`rarity.${fish.rarity}`)})
                    </span>
                    {locked && <span className="text-red-400">{t("hud.level", { n: fish.minLevel })}</span>}
                  </div>
                  {!locked && (
                    <div className="font-game text-[6px] text-white/50">
                      {fish.xp} XP | Цена: {fish.sellPrice.toFixed(1)}м
                    </div>
                  )}
                </div>
                {!locked && (
                  <span className="font-game text-[7px] text-white/60">{owned}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "sell" && (
        <div className="space-y-1">
          {FISH.map((fish) => {
            const qty = inventory[fish.id] ?? 0;
            return (
              <div key={fish.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${qty > 0 ? "bg-brown-600" : "bg-brown-600/40 opacity-50"}`}>
                <span className="text-sm">{fish.emoji}</span>
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{fish.name}</div>
                  <div className="font-game text-[6px] text-yellow-300">{fish.sellPrice.toFixed(1)}м</div>
                </div>
                <span className="font-game text-[7px] text-white/60">{qty}</span>
                <PixelButton variant="secondary" disabled={qty < 1}
                  onClick={() => sellFish(fish.id, 1)}>1</PixelButton>
                <PixelButton variant="secondary" disabled={qty < 1}
                  onClick={() => sellFish(fish.id, qty)}>{t("shop.btn.all")}</PixelButton>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
