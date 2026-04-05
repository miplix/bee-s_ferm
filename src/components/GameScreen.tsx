"use client";

import { useState, useCallback } from "react";
import { GRID_COLS, GRID_ROWS, CELL_SIZE } from "@/game/config";
import type { InventoryStack } from "@/types";

interface Props {
  accountId: string;
  onDisconnect: () => void;
}

export default function GameScreen({ accountId, onDisconnect }: Props) {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [playerMenuOpen, setPlayerMenuOpen] = useState(false);
  const [quickbar, setQuickbar] = useState<InventoryStack[]>([]);

  // Placeholder inventory (empty for now)
  const [inventory] = useState<InventoryStack[]>([]);

  const selectToQuickbar = useCallback((item: InventoryStack) => {
    setQuickbar((prev) => {
      const filtered = prev.filter((i) => i.item_type !== item.item_type);
      return [item, ...filtered].slice(0, 3);
    });
  }, []);

  const displayName = accountId.split(".")[0];

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
      {/* === TOP BAR === */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2">
        {/* Player menu button — top left */}
        <button
          onClick={() => { setPlayerMenuOpen(!playerMenuOpen); setInventoryOpen(false); }}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg flex items-center justify-center text-lg transition-colors border border-white/10"
          title="Меню игрока"
        >
          👤
        </button>

        {/* Inventory button — top right */}
        <button
          onClick={() => { setInventoryOpen(!inventoryOpen); setPlayerMenuOpen(false); }}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg flex items-center justify-center text-lg transition-colors border border-white/10"
          title="Инвентарь"
        >
          📦
        </button>
      </div>

      {/* === PLAYER MENU (top left dropdown) === */}
      {playerMenuOpen && (
        <div className="absolute top-14 left-3 z-30 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 w-56">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">👤</div>
            <div>
              <div className="text-white text-sm font-medium">{displayName}</div>
              <div className="text-gray-500 text-[10px] font-mono">{accountId}</div>
            </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1 mb-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            NEAR mainnet
          </div>
          <button
            onClick={onDisconnect}
            className="w-full text-xs bg-red-900/50 hover:bg-red-800/70 text-red-300 py-2 rounded-lg transition-colors"
          >
            ⏏ Отключить кошелёк
          </button>
        </div>
      )}

      {/* === INVENTORY PANEL (top right dropdown) === */}
      {inventoryOpen && (
        <div className="absolute top-14 right-3 z-30 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 w-64 max-h-[70vh] overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2">📦 Инвентарь</div>
          {inventory.length === 0 ? (
            <div className="text-gray-600 text-xs py-4 text-center">Пусто</div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {inventory.map((item) => (
                <button
                  key={item.item_type}
                  onClick={() => selectToQuickbar(item)}
                  className="relative w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex flex-col items-center justify-center transition-colors"
                  title={item.name}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === QUICKBAR (right side, 3 slots) === */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        {[0, 1, 2].map((i) => {
          const item = quickbar[i];
          return (
            <div
              key={i}
              className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center backdrop-blur"
            >
              {item ? (
                <span className="text-lg" title={item.name}>{item.emoji}</span>
              ) : (
                <span className="text-gray-600 text-xs">—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* === GAME FIELD === */}
      <div className="flex-1 flex items-center justify-center" onClick={() => { setPlayerMenuOpen(false); setInventoryOpen(false); }}>
        <div
          className="relative select-none"
          style={{
            width: GRID_COLS * CELL_SIZE,
            height: GRID_ROWS * CELL_SIZE,
            borderRadius: 8,
            border: "2px solid #2d6b35",
            overflow: "hidden",
          }}
        >
          {/* Grass tiles */}
          {Array.from({ length: GRID_ROWS }, (_, y) =>
            Array.from({ length: GRID_COLS }, (_, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: (x + y) % 2 === 0 ? "#3a7d44" : "#358040",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
