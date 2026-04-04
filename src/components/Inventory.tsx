"use client";

import type { InventoryStack } from "@/types";
import { ITEM_DEFS, RESOURCE_DEFS } from "@/game/config";

interface Props {
  inventory: InventoryStack[];
  onPlaceItem: (itemType: string) => void;
  mode: string;
}

export default function Inventory({ inventory, onPlaceItem, mode }: Props) {
  if (inventory.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        Инвентарь пуст
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {inventory.map((stack) => {
        const itemDef = ITEM_DEFS[stack.item_type];
        const resDef = RESOURCE_DEFS[stack.item_type];
        const emoji = itemDef?.emoji || resDef?.emoji || "📦";
        const name = itemDef?.name || resDef?.name || stack.item_type;
        const canPlace = itemDef?.placeable && mode === "idle";

        return (
          <div
            key={stack.item_type}
            className={`
              relative flex flex-col items-center justify-center
              w-16 h-16 rounded-lg border-2 transition-all
              ${canPlace
                ? "border-green-500/50 bg-green-900/30 cursor-pointer hover:bg-green-800/40 hover:border-green-400"
                : "border-gray-600/50 bg-gray-800/30"
              }
            `}
            onClick={() => canPlace && onPlaceItem(stack.item_type)}
            title={`${name} (${stack.count})`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {stack.count}
            </span>
            <span className="text-[9px] text-gray-300 truncate w-full text-center mt-0.5">
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
