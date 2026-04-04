"use client";

import type { InventoryStack } from "@/types";
import { ITEM_DEFS, RESOURCE_DEFS, CROP_DEFS } from "@/game/config";

interface Props {
  inventory: InventoryStack[];
  onPlaceItem: (itemType: string) => void;
  mode: string;
}

function getItemInfo(itemType: string): { emoji: string; name: string; placeable: boolean } {
  const itemDef = ITEM_DEFS[itemType];
  if (itemDef) return { emoji: itemDef.emoji, name: itemDef.name, placeable: itemDef.placeable };

  const resDef = RESOURCE_DEFS[itemType];
  if (resDef) return { emoji: resDef.emoji, name: resDef.name, placeable: false };

  // Seeds
  if (itemType.endsWith("_seed")) {
    const cropType = itemType.replace("_seed", "");
    const cropDef = CROP_DEFS[cropType];
    if (cropDef) return { emoji: "🌱", name: `Семена: ${cropDef.name}`, placeable: false };
  }

  // Harvested crops
  if (itemType.endsWith("_harvest")) {
    const cropType = itemType.replace("_harvest", "");
    const cropDef = CROP_DEFS[cropType];
    if (cropDef) return { emoji: cropDef.emoji, name: cropDef.name, placeable: false };
  }

  return { emoji: "📦", name: itemType, placeable: false };
}

export default function Inventory({ inventory, onPlaceItem, mode }: Props) {
  if (inventory.length === 0) {
    return <div className="text-gray-500 text-sm text-center py-3">Инвентарь пуст</div>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-1">
      {inventory.map((stack) => {
        const info = getItemInfo(stack.item_type);
        const canPlace = info.placeable && mode === "idle";
        return (
          <div key={stack.item_type}
            className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition-all ${canPlace ? "border-green-500/50 bg-green-900/30 cursor-pointer hover:bg-green-800/40" : "border-gray-600/40 bg-gray-800/30"}`}
            onClick={() => canPlace && onPlaceItem(stack.item_type)}
            title={`${info.name} (${stack.count})`}
          >
            <span className="text-xl">{info.emoji}</span>
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
              {stack.count}
            </span>
            <span className="text-[8px] text-gray-400 truncate w-full text-center leading-tight">{info.name}</span>
          </div>
        );
      })}
    </div>
  );
}
