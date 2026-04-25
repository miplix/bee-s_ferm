import { useState } from "react";
import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { CROPS, getCropDef } from "../../data/crops.data";
import { FRUITS } from "../../data/fruits.data";
import { FLOWERS } from "../../data/flowers.data";
import { GREENHOUSE_CROPS } from "../../data/greenhouse.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import type { CropId, FruitId, FlowerId, GreenhouseCropId } from "../../domain/types/ids";

type Tab = "seeds" | "fruits" | "flowers" | "greenhouse" | "sell";

// Deflationary resource sell prices
const RESOURCE_SELL: Record<string, { price: number; icon: string; name: string }> = {
  wood:  { price: 0.02, icon: "🪵", name: "Дерево" },
  stone: { price: 0.05, icon: "🪨", name: "Камень" },
  iron:  { price: 0.20, icon: "⛓️", name: "Железо" },
  gold:  { price: 1.00, icon: "✨", name: "Золото" },
  egg:   { price: 0.30, icon: "🥚", name: "Яйцо" },
  milk:  { price: 0.80, icon: "🥛", name: "Молоко" },
  wool:  { price: 0.50, icon: "🧶", name: "Шерсть" },
  honey: { price: 5.00, icon: "🍯", name: "Мёд" },
};

export function ShopPanel() {
  const [tab, setTab] = useState<Tab>("seeds");
  const level = useStore(selectLevel);
  const coins = useStore((s) => s.coins);
  const inventory = useStore((s) => s.inventory);
  const buySeed = useStore((s) => s.buySeed);
  const buyFruitSeed = useStore((s) => s.buyFruitSeed);
  const buyFlowerSeed = useStore((s) => s.buyFlowerSeed);
  const buyGreenhouseSeed = useStore((s) => s.buyGreenhouseSeed);
  const selectTool = useStore((s) => s.selectTool);
  const sell = useStore((s) => s.sell);
  const sellAll = useStore((s) => s.sellAll);

  return (
    <PanelShell title="Магазин">
      <div className="flex gap-1 mb-3 flex-wrap">
        {(["seeds", "fruits", "flowers", "greenhouse", "sell"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-game text-[8px] px-3 py-1 border border-black/30
              ${tab === t ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}>
            {t === "seeds" ? "Семена" : t === "fruits" ? "Фрукты" : t === "flowers" ? "Цветы" : t === "greenhouse" ? "Теплица" : "Продать"}
          </button>
        ))}
      </div>

      {tab === "seeds" && (
        <div className="space-y-1">
          {CROPS.map((crop) => {
            const locked = crop.level > level;
            const seedId = `${crop.id}_seed`;
            const owned = inventory[seedId] ?? 0;
            const canAfford = !locked && coins >= crop.seedPrice;

            return (
              <div key={crop.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${locked ? "bg-brown-600/50 opacity-60" : "bg-brown-600"}`}>
                <span className="text-sm">{crop.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate flex items-center gap-1">
                    {crop.name}
                    {locked && <span className="text-red-400">🔒 Lv.{crop.level}</span>}
                  </div>
                  {!locked && (
                    <div className="font-game text-[6px] text-white/50">
                      {crop.seedPrice.toFixed(2)}c | {formatGrowTime(crop.growMs)} | sell: {crop.sellPrice.toFixed(2)}c
                    </div>
                  )}
                </div>
                {!locked && (
                  <>
                    <span className="font-game text-[7px] text-white/60 w-6 text-right">{owned}</span>
                    <PixelButton disabled={!canAfford}
                      onClick={() => { buySeed(crop.id as CropId, 1); selectTool(seedId); }}>
                      Купить
                    </PixelButton>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "fruits" && (
        <div className="space-y-1">
          {FRUITS.map((fruit) => {
            const locked = fruit.level > level;
            const seedId = `${fruit.id}_seed`;
            const owned = inventory[seedId] ?? 0;
            const canAfford = !locked && coins >= fruit.seedPrice;

            return (
              <div key={fruit.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${locked ? "bg-brown-600/50 opacity-60" : "bg-brown-600"}`}>
                <span className="text-sm">{fruit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate flex items-center gap-1">
                    {fruit.name}
                    {locked && <span className="text-red-400">🔒 Lv.{fruit.level}</span>}
                  </div>
                  {!locked && (
                    <div className="font-game text-[6px] text-white/50">
                      {fruit.seedPrice}c | {formatGrowTime(fruit.growMs)} | sell: {fruit.sellPrice}c | {fruit.minHarvests}-{fruit.maxHarvests} harvests
                    </div>
                  )}
                </div>
                {!locked && (
                  <>
                    <span className="font-game text-[7px] text-white/60 w-6 text-right">{owned}</span>
                    <PixelButton disabled={!canAfford}
                      onClick={() => { buyFruitSeed(fruit.id as FruitId, 1); selectTool(seedId); }}>
                      Купить
                    </PixelButton>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "flowers" && (
        <div className="space-y-1">
          {FLOWERS.map((flower) => {
            const locked = flower.level > level;
            const seedId = `${flower.id}_seed`;
            const owned = inventory[seedId] ?? 0;
            const canAfford = !locked && coins >= flower.seedPrice;

            return (
              <div key={flower.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${locked ? "bg-brown-600/50 opacity-60" : "bg-brown-600"}`}>
                <span className="text-sm">{flower.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate flex items-center gap-1">
                    {flower.name}
                    {locked && <span className="text-red-400">🔒 Lv.{flower.level}</span>}
                  </div>
                  {!locked && (
                    <div className="font-game text-[6px] text-white/50">
                      {flower.seedPrice}c | {formatGrowTime(flower.growMs)}
                    </div>
                  )}
                </div>
                {!locked && (
                  <>
                    <span className="font-game text-[7px] text-white/60 w-6 text-right">{owned}</span>
                    <PixelButton disabled={!canAfford}
                      onClick={() => { buyFlowerSeed(flower.id as FlowerId, 1); selectTool(seedId); }}>
                      Купить
                    </PixelButton>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "greenhouse" && (
        <div className="space-y-1">
          {GREENHOUSE_CROPS.map((crop) => {
            const locked = crop.level > level;
            const seedId = `${crop.id}_seed`;
            const owned = inventory[seedId] ?? 0;
            const canAfford = !locked && coins >= crop.seedPrice;

            return (
              <div key={crop.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${locked ? "bg-brown-600/50 opacity-60" : "bg-brown-600"}`}>
                <span className="text-sm">{crop.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate flex items-center gap-1">
                    {crop.name}
                    {locked && <span className="text-red-400">🔒 Lv.{crop.level}</span>}
                  </div>
                  {!locked && (
                    <div className="font-game text-[6px] text-white/50">
                      {crop.seedPrice}c | {formatGrowTime(crop.growMs)} | oil: {crop.oilCost} | sell: {crop.sellPrice}c
                    </div>
                  )}
                </div>
                {!locked && (
                  <>
                    <span className="font-game text-[7px] text-white/60 w-6 text-right">{owned}</span>
                    <PixelButton disabled={!canAfford}
                      onClick={() => { buyGreenhouseSeed(crop.id as GreenhouseCropId, 1); selectTool(seedId); }}>
                      Купить
                    </PixelButton>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "sell" && (
        <div className="space-y-1">
          {/* Crops */}
          <h4 className="font-game text-[7px] text-yellow-300">Культуры</h4>
          {CROPS.map((crop) => {
            const qty = inventory[crop.id] ?? 0;
            return (
              <div key={crop.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${qty > 0 ? "bg-brown-600" : "bg-brown-600/40 opacity-50"}`}>
                <span className="text-sm">{crop.emoji}</span>
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{crop.name}</div>
                  <div className="font-game text-[6px] text-yellow-300">{crop.sellPrice.toFixed(2)}c</div>
                </div>
                <span className="font-game text-[7px] text-white/60">{qty}</span>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sell(crop.id, 1)}>1</PixelButton>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sellAll(crop.id)}>Всё</PixelButton>
              </div>
            );
          })}

          {/* Fruits */}
          <h4 className="font-game text-[7px] text-yellow-300 mt-2">Фрукты</h4>
          {FRUITS.map((fruit) => {
            const qty = inventory[fruit.id] ?? 0;
            return (
              <div key={fruit.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${qty > 0 ? "bg-brown-600" : "bg-brown-600/40 opacity-50"}`}>
                <span className="text-sm">{fruit.emoji}</span>
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{fruit.name}</div>
                  <div className="font-game text-[6px] text-yellow-300">{fruit.sellPrice}c</div>
                </div>
                <span className="font-game text-[7px] text-white/60">{qty}</span>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sell(fruit.id, 1)}>1</PixelButton>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sellAll(fruit.id)}>All</PixelButton>
              </div>
            );
          })}

          {/* Greenhouse Crops */}
          <h4 className="font-game text-[7px] text-yellow-300 mt-2">Теплица</h4>
          {GREENHOUSE_CROPS.map((crop) => {
            const qty = inventory[crop.id] ?? 0;
            return (
              <div key={crop.id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${qty > 0 ? "bg-brown-600" : "bg-brown-600/40 opacity-50"}`}>
                <span className="text-sm">{crop.emoji}</span>
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{crop.name}</div>
                  <div className="font-game text-[6px] text-yellow-300">{crop.sellPrice}c</div>
                </div>
                <span className="font-game text-[7px] text-white/60">{qty}</span>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sell(crop.id, 1)}>1</PixelButton>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sellAll(crop.id)}>Всё</PixelButton>
              </div>
            );
          })}

          {/* Resources */}
          <h4 className="font-game text-[7px] text-yellow-300 mt-2">Ресурсы</h4>
          {Object.entries(RESOURCE_SELL).map(([id, { price, icon, name }]) => {
            const qty = inventory[id] ?? 0;
            return (
              <div key={id}
                className={`flex items-center gap-2 p-1.5 border border-black/20
                  ${qty > 0 ? "bg-brown-600" : "bg-brown-600/40 opacity-50"}`}>
                <span className="text-sm">{icon}</span>
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{name}</div>
                  <div className="font-game text-[6px] text-yellow-300">{price.toFixed(2)}c</div>
                </div>
                <span className="font-game text-[7px] text-white/60">{qty}</span>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sell(id, 1)}>1</PixelButton>
                <PixelButton variant="secondary" disabled={qty < 1} onClick={() => sellAll(id)}>Всё</PixelButton>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}

function formatGrowTime(ms: number): string {
  const min = ms / 60_000;
  if (min < 60) return `${min}m`;
  const h = min / 60;
  if (h < 24) return `${h}h`;
  return `${(h / 24).toFixed(1)}d`;
}
