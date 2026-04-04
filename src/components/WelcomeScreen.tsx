"use client";

import type { InventoryStack } from "@/types";
import { ITEM_DEFS, RESOURCE_DEFS } from "@/game/config";

interface Props {
  accountId: string;
  inventory: InventoryStack[];
  onPlay: () => void;
  onDisconnect: () => void;
}

export default function WelcomeScreen({ accountId, inventory, onPlay, onDisconnect }: Props) {
  const displayName = accountId.split(".")[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-4">
      <div className="bg-gray-900/90 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🌾</div>
          <h1 className="text-2xl font-bold text-white mb-1">Добро пожаловать!</h1>
          <p className="text-gray-400 text-sm">Твоя ферма ждёт тебя</p>
        </div>

        {/* Player info */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <div className="text-white font-bold">{displayName}</div>
              <div className="text-gray-500 text-xs font-mono">{accountId}</div>
            </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Кошелёк подключён (NEAR mainnet)
          </div>
        </div>

        {/* Inventory preview */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-400 mb-2">📦 Инвентарь</div>
          {inventory.length === 0 ? (
            <div className="text-gray-600 text-sm">Пусто</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {inventory.map((stack) => {
                const def = ITEM_DEFS[stack.item_type] || RESOURCE_DEFS[stack.item_type];
                const emoji = (def as any)?.emoji || "📦";
                return (
                  <div
                    key={stack.item_type}
                    className="flex items-center gap-1 bg-gray-700/50 rounded-lg px-2 py-1"
                  >
                    <span>{emoji}</span>
                    <span className="text-xs text-gray-300">×{stack.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={onPlay}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-lg transition-colors mb-3"
        >
          🎮 Играть
        </button>
        <button
          onClick={onDisconnect}
          className="w-full py-2 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300 rounded-xl text-sm transition-colors"
        >
          Отключить кошелёк
        </button>
      </div>
    </div>
  );
}
