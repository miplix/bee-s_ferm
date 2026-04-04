"use client";

import { CROP_DEFS, RESOURCE_DEFS, ITEM_DEFS } from "@/game/config";
import type { InventoryStack } from "@/types";

interface Props {
  coins: number;
  inventory: InventoryStack[];
  onBuySeed: (cropType: string, qty: number) => void;
  onBuyItem: (itemType: string, price: number, qty: number) => void;
  onSell: (itemType: string, qty: number) => void;
  onClose: () => void;
}

function formatTime(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}с`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}м`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}ч`;
  return `${Math.round(ms / 86_400_000)}д`;
}

export default function Shop({ coins, inventory, onBuySeed, onBuyItem, onSell, onClose }: Props) {
  const sellable = inventory.filter((s) => {
    const r = RESOURCE_DEFS[s.item_type];
    return r?.sellPrice && r.sellPrice > 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900 rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-white">🏪 Рынок</h2>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 font-bold">🪙 {coins}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>
        </div>

        {/* Buy Seeds */}
        <div className="p-4">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">🌱 Купить семена</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(CROP_DEFS).map((crop) => (
              <div key={crop.type} className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-3">
                <span className="text-2xl">{crop.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{crop.name}</div>
                  <div className="text-xs text-gray-500">
                    Рост: {formatTime(crop.growthTime)} · Продажа: 🪙{crop.sellPrice}×{crop.harvestAmount}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400">🪙{crop.seedPrice}</span>
                  <button
                    onClick={() => onBuySeed(crop.type, 1)}
                    disabled={coins < crop.seedPrice}
                    className="text-xs bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ×1
                  </button>
                  <button
                    onClick={() => onBuySeed(crop.type, 5)}
                    disabled={coins < crop.seedPrice * 5}
                    className="text-xs bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ×5
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Items */}
        <div className="p-4 pt-0">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">🛒 Купить предметы</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: "field", price: 10 },
              { type: "fence", price: 5 },
            ].map(({ type, price }) => {
              const def = ITEM_DEFS[type];
              if (!def) return null;
              return (
                <div key={type} className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3">
                  <span className="text-xl">{def.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm text-white">{def.name}</div>
                    <div className="text-xs text-yellow-400">🪙{price}</div>
                  </div>
                  <button
                    onClick={() => onBuyItem(type, price, 1)}
                    disabled={coins < price}
                    className="text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white px-2 py-1 rounded"
                  >
                    Купить
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sell Resources */}
        <div className="p-4 pt-0">
          <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">💰 Продать</h3>
          {sellable.length === 0 ? (
            <div className="text-gray-600 text-sm py-2">Нечего продавать</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {sellable.map((stack) => {
                const res = RESOURCE_DEFS[stack.item_type];
                if (!res) return null;
                return (
                  <div key={stack.item_type} className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-3">
                    <span className="text-xl">{res.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{res.name} ×{stack.count}</div>
                      <div className="text-xs text-yellow-400">🪙{res.sellPrice} за шт.</div>
                    </div>
                    <button
                      onClick={() => onSell(stack.item_type, 1)}
                      className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded"
                    >
                      ×1
                    </button>
                    <button
                      onClick={() => onSell(stack.item_type, stack.count)}
                      className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-2 py-1 rounded"
                    >
                      Всё
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
