"use client";

import type { PlacedObject } from "@/types";
import { ITEM_DEFS, CELL_SIZE } from "@/game/config";

interface Props {
  object: PlacedObject;
  onDestroy: () => void;
  onPickup: () => void;
  onMove: () => void;
  onClose: () => void;
}

export default function ObjectMenu({ object, onDestroy, onPickup, onMove, onClose }: Props) {
  const def = ITEM_DEFS[object.object_type];
  if (!def) return null;

  return (
    <div
      className="absolute z-50 bg-gray-900/95 border border-gray-600 rounded-xl p-3 shadow-2xl min-w-[160px]"
      style={{
        left: object.grid_x * CELL_SIZE + CELL_SIZE + 8,
        top: object.grid_y * CELL_SIZE,
      }}
    >
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
        <span className="text-xl">{def.emoji}</span>
        <span className="text-sm font-bold text-white">{def.name}</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {object.is_scenery ? (
          <>
            <button
              onClick={onDestroy}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/70 text-red-300 transition-colors"
            >
              ⛏️ Уничтожить ({(def.destroyTime / 1000).toFixed(1)}с)
            </button>
            {def.dropType && (
              <div className="text-xs text-gray-500 px-1">
                Выпадет: {def.dropAmount}× {def.dropType}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onMove}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-blue-900/50 hover:bg-blue-800/70 text-blue-300 transition-colors"
            >
              ↔️ Переместить
            </button>
            <button
              onClick={onPickup}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 transition-colors"
            >
              📥 Забрать в инвентарь
            </button>
          </>
        )}
      </div>
    </div>
  );
}
