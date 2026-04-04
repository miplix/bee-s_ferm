"use client";

import type { PlacedObject, InventoryStack } from "@/types";
import { ITEM_DEFS, CROP_DEFS, CELL_SIZE } from "@/game/config";

interface Props {
  object: PlacedObject;
  inventory: InventoryStack[];
  onDestroy: () => void;
  onPickup: () => void;
  onMove: () => void;
  onPlant: (cropType: string) => void;
  onHarvest: () => void;
  onClose: () => void;
}

function formatTime(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}с`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}м`;
  return `${Math.round(ms / 3_600_000)}ч`;
}

export default function ObjectMenu({ object, inventory, onDestroy, onPickup, onMove, onPlant, onHarvest, onClose }: Props) {
  const def = ITEM_DEFS[object.object_type];
  if (!def) return null;

  const isField = def.isField;
  const hasCrop = !!object.crop;
  const isReady = hasCrop && object.plantedAt && object.growthDuration
    ? Date.now() - object.plantedAt >= object.growthDuration : false;
  const cropDef = object.crop ? CROP_DEFS[object.crop] : null;

  // Available seeds in inventory
  const seeds = inventory.filter((s) => s.item_type.endsWith("_seed"));

  // Time remaining
  let timeLeft = "";
  if (hasCrop && !isReady && object.plantedAt && object.growthDuration) {
    const remaining = object.growthDuration - (Date.now() - object.plantedAt);
    timeLeft = formatTime(Math.max(0, remaining));
  }

  return (
    <div className="absolute z-50 bg-gray-900/95 border border-gray-600 rounded-xl p-3 shadow-2xl min-w-[180px]"
      style={{ left: object.grid_x * CELL_SIZE + CELL_SIZE + 8, top: object.grid_y * CELL_SIZE }}>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
        <span className="text-xl">{hasCrop && cropDef ? cropDef.emoji : def.emoji}</span>
        <span className="text-sm font-bold text-white">{hasCrop && cropDef ? cropDef.name : def.name}</span>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white text-lg leading-none">✕</button>
      </div>

      <div className="flex flex-col gap-1.5">
        {/* Field with ready crop */}
        {isField && hasCrop && isReady && (
          <button onClick={onHarvest} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-green-800/60 hover:bg-green-700/70 text-green-300 transition-colors">
            🌾 Собрать урожай ({cropDef?.harvestAmount}× {cropDef?.emoji})
          </button>
        )}

        {/* Field with growing crop */}
        {isField && hasCrop && !isReady && (
          <div className="text-sm text-yellow-300 px-3 py-2 bg-yellow-900/30 rounded-lg">
            ⏳ Растёт... ({timeLeft})
          </div>
        )}

        {/* Empty field — plant */}
        {isField && !hasCrop && (
          <>
            {seeds.length === 0 ? (
              <div className="text-xs text-gray-500 px-2 py-1">Нет семян. Купите на рынке 🏪</div>
            ) : (
              seeds.map((s) => {
                const cropType = s.item_type.replace("_seed", "");
                const cd = CROP_DEFS[cropType];
                if (!cd) return null;
                return (
                  <button key={s.item_type} onClick={() => onPlant(cropType)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg bg-green-900/40 hover:bg-green-800/60 text-green-300 transition-colors flex items-center gap-2">
                    <span>{cd.seedEmoji}</span>
                    <span>Посадить {cd.name}</span>
                    <span className="ml-auto text-xs text-gray-500">×{s.count}</span>
                  </button>
                );
              })
            )}
          </>
        )}

        {/* Scenery — destroy */}
        {object.is_scenery && (
          <>
            <button onClick={onDestroy} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/70 text-red-300 transition-colors">
              ⛏️ Уничтожить ({(def.destroyTime / 1000).toFixed(1)}с)
            </button>
            {def.dropType && <div className="text-xs text-gray-500 px-1">Выпадет: {def.dropAmount}× {def.dropType}</div>}
          </>
        )}

        {/* Non-scenery, non-field — move/pickup */}
        {!object.is_scenery && !isField && (
          <>
            <button onClick={onMove} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-blue-900/50 hover:bg-blue-800/70 text-blue-300 transition-colors">
              ↔️ Переместить
            </button>
            <button onClick={onPickup} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 transition-colors">
              📥 Забрать
            </button>
          </>
        )}

        {/* Field without crop — move/pickup */}
        {isField && !hasCrop && (
          <>
            <button onClick={onMove} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-blue-900/50 hover:bg-blue-800/70 text-blue-300 transition-colors">
              ↔️ Переместить
            </button>
            <button onClick={onPickup} className="w-full text-left text-sm px-3 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 transition-colors">
              📥 Забрать
            </button>
          </>
        )}
      </div>
    </div>
  );
}
