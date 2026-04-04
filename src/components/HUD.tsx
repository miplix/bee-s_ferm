"use client";

import type { InventoryItem } from "@/types";

interface Props {
  accountId: string;
  resources: Record<string, number>;
  inventory: InventoryItem[];
  onPlaceItem: (item: InventoryItem) => void;
  onCraft: (recipeId: string) => void;
  onVisit: () => void;
  onDisconnect: () => void;
}

const RESOURCE_ICONS: Record<string, string> = {
  wood: "🪵", stone: "🪨", gold: "🪙", wheat: "🌾", iron: "⛏️",
  plank: "🪵", tool: "🔧", jewelry: "💎",
};

export default function HUD({ accountId, resources, inventory, onPlaceItem, onCraft, onVisit, onDisconnect }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="pointer-events-auto flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-400 font-mono">{accountId}</span>
          <button onClick={onVisit} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">
            🏠 В гости
          </button>
        </div>
        <div className="flex gap-3">
          {Object.entries(resources).map(([key, val]) => (
            <span key={key} className="text-sm">
              {RESOURCE_ICONS[key] || "📦"} {val}
            </span>
          ))}
        </div>
        <button onClick={onDisconnect} className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded">
          Выйти
        </button>
      </div>

      {/* Inventory panel (bottom) */}
      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 bg-black/60 backdrop-blur-sm">
        {inventory.length === 0 && (
          <span className="text-gray-400 text-sm">Инвентарь пуст — купите NFT объекты</span>
        )}
        {inventory.map((item) => (
          <button
            key={item.token_id}
            onClick={() => onPlaceItem(item)}
            className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-lg flex flex-col items-center justify-center border border-gray-600"
            title={item.name}
          >
            <span className="text-2xl">{item.icon || "📦"}</span>
            <span className="text-[10px] text-gray-300 truncate w-full text-center">{item.name}</span>
          </button>
        ))}

        <div className="ml-4 border-l border-gray-600 pl-4 flex gap-2">
          <button onClick={() => onCraft("plank")} className="text-xs bg-amber-700 hover:bg-amber-600 px-2 py-1 rounded" title="5 wood → 2 plank">
            🪵 Доски
          </button>
          <button onClick={() => onCraft("tool")} className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded" title="3 iron + 2 wood → 1 tool">
            🔧 Инструмент
          </button>
          <button onClick={() => onCraft("jewelry")} className="text-xs bg-yellow-700 hover:bg-yellow-600 px-2 py-1 rounded" title="5 gold + 1 iron → 1 jewelry">
            💎 Украшение
          </button>
        </div>
      </div>
    </div>
  );
}
