"use client";

import { useCallback } from "react";
import FarmGrid from "./FarmGrid";
import Inventory from "./Inventory";
import ObjectMenu from "./ObjectMenu";
import DestroyProgress from "./DestroyProgress";
import { useGameState } from "@/game/useGameState";
import { ITEM_DEFS, RESOURCE_DEFS } from "@/game/config";
import type { PlacedObject, DroppedResource } from "@/types";

interface Props {
  accountId: string;
  onDisconnect: () => void;
  onOpenMenu: () => void;
}

export default function GameScreen({ accountId, onDisconnect, onOpenMenu }: Props) {
  const {
    state, startPlacing, confirmPlacement, cancelAction,
    selectObject, closeMenu, pickupObject, startDestroy,
    completeDestroy, collectDrop, startMoving, confirmMove,
  } = useGameState();

  const handleCellClick = useCallback((x: number, y: number) => {
    if (state.mode === "placing") {
      confirmPlacement(x, y);
    } else if (state.mode === "moving") {
      confirmMove(x, y);
    }
  }, [state.mode, confirmPlacement, confirmMove]);

  const handleObjectClick = useCallback((obj: PlacedObject) => {
    if (state.mode === "idle") {
      selectObject(obj);
    }
  }, [state.mode, selectObject]);

  const handleDropClick = useCallback((drop: DroppedResource) => {
    collectDrop(drop.id);
  }, [collectDrop]);

  const displayName = accountId.split(".")[0];

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="text-xl hover:scale-110 transition-transform"
            title="Меню"
          >
            👤
          </button>
          <span className="text-sm text-green-400 font-mono">{displayName}</span>
        </div>
        <div className="text-lg font-bold text-white">🌾 NEAR Farm</div>
        <button
          onClick={onDisconnect}
          className="text-xs bg-red-900/50 hover:bg-red-800/70 text-red-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Выйти
        </button>
      </div>

      {/* Mode bar */}
      {state.mode !== "idle" && (
        <div className="flex items-center justify-center gap-3 px-4 py-2 bg-yellow-900/60 border-b border-yellow-700/50">
          <span className="text-sm text-yellow-200">
            {state.mode === "placing" && `📍 Выберите клетку для размещения «${ITEM_DEFS[state.selectedItem!]?.name}»`}
            {state.mode === "moving" && "↔️ Выберите новое место для объекта"}
            {state.mode === "destroying" && "⛏️ Уничтожение..."}
          </span>
          {state.mode !== "destroying" && (
            <button
              onClick={cancelAction}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              Отмена
            </button>
          )}
        </div>
      )}

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="relative">
          <FarmGrid
            objects={state.objects}
            drops={state.drops}
            mode={state.mode}
            selectedItem={state.selectedItem}
            selectedObject={state.selectedObject}
            onCellClick={handleCellClick}
            onObjectClick={handleObjectClick}
            onDropClick={handleDropClick}
          />

          {/* Object context menu */}
          {state.selectedObject && state.menuOpen && state.mode === "idle" && (
            <ObjectMenu
              object={state.selectedObject}
              onDestroy={() => startDestroy(state.selectedObject!.id)}
              onPickup={() => pickupObject(state.selectedObject!.id)}
              onMove={() => startMoving(state.selectedObject!.id)}
              onClose={closeMenu}
            />
          )}

          {/* Destroy progress bar */}
          {state.mode === "destroying" && state.selectedObject && (
            <DestroyProgress
              object={state.selectedObject}
              onComplete={() => completeDestroy(state.selectedObject!.id)}
              onCancel={cancelAction}
            />
          )}
        </div>
      </div>

      {/* Bottom panel: Inventory */}
      <div className="bg-black/60 border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">📦 Инвентарь</span>
          <span className="text-xs text-gray-600">
            {state.inventory.reduce((sum, s) => sum + s.count, 0)} предметов
          </span>
        </div>
        <Inventory
          inventory={state.inventory}
          onPlaceItem={startPlacing}
          mode={state.mode}
        />
      </div>
    </div>
  );
}
