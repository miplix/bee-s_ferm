"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GRID_COLS, GRID_ROWS, CELL_SIZE } from "@/game/config";
import type { InventoryStack, PlacedObject, NftItem } from "@/types";

interface Props {
  accountId: string;
  onDisconnect: () => void;
}

type Mode = "idle" | "placing" | "selected";

const SAVE_KEY = (id: string) => `farm_v2__${id}`;

interface SaveData {
  inventory: InventoryStack[];
  placed: PlacedObject[];
  quickbar: string[]; // item_types
}

function loadSave(accountId: string): SaveData | null {
  try { const r = localStorage.getItem(SAVE_KEY(accountId)); return r ? JSON.parse(r) : null; } catch { return null; }
}
function writeSave(accountId: string, d: SaveData) {
  try { localStorage.setItem(SAVE_KEY(accountId), JSON.stringify(d)); } catch {}
}

let placeId = 0;
function uid() { return `p_${++placeId}_${Date.now()}`; }

export default function GameScreen({ accountId, onDisconnect }: Props) {
  const [inventory, setInventory] = useState<InventoryStack[]>([]);
  const [placed, setPlaced] = useState<PlacedObject[]>([]);
  const [quickbar, setQuickbar] = useState<string[]>([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [playerMenuOpen, setPlayerMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [placingItem, setPlacingItem] = useState<InventoryStack | null>(null);
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedObj, setSelectedObj] = useState<PlacedObject | null>(null);
  const [nftLoaded, setNftLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // === LOAD SAVE ===
  useEffect(() => {
    const save = loadSave(accountId);
    if (save) {
      setInventory(save.inventory);
      setPlaced(save.placed);
      setQuickbar(save.quickbar || []);
    }
  }, [accountId]);

  // === AUTO-SAVE ===
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writeSave(accountId, { inventory, placed, quickbar });
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [accountId, inventory, placed, quickbar]);

  // === SAVE ON UNLOAD ===
  useEffect(() => {
    const fn = () => writeSave(accountId, { inventory, placed, quickbar });
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [accountId, inventory, placed, quickbar]);

  // === FETCH NFTs ===
  useEffect(() => {
    if (nftLoaded) return;
    setNftLoaded(true);

    // Read placed objects from save DIRECTLY (not from state which may be stale)
    const save = loadSave(accountId);
    const savedPlaced = save?.placed || [];

    fetch(`/api/nft?owner=${encodeURIComponent(accountId)}`)
      .then((r) => r.json())
      .then((data: { items: NftItem[] }) => {
        const items = data.items || [];
        // Stack by title
        const stacks = new Map<string, InventoryStack>();
        for (const nft of items) {
          const key = nft.title;
          const existing = stacks.get(key);
          if (existing) {
            existing.count++;
            existing.tokenIds.push(nft.token_id);
          } else {
            stacks.set(key, {
              item_type: key,
              count: 1,
              name: nft.title,
              image: nft.media,
              tokenIds: [nft.token_id],
            });
          }
        }
        const nftInventory = Array.from(stacks.values());

        // Count how many of each type are placed on the map
        const placedCounts = new Map<string, number>();
        for (const p of savedPlaced) {
          placedCounts.set(p.item_type, (placedCounts.get(p.item_type) || 0) + 1);
        }

        // Subtract placed from NFT counts
        const adjusted = nftInventory.map((stack) => {
          const usedOnMap = placedCounts.get(stack.item_type) || 0;
          return { ...stack, count: Math.max(0, stack.count - usedOnMap) };
        }).filter((s) => s.count > 0);

        setInventory(adjusted);
      })
      .catch(() => {});
  }, [accountId, nftLoaded]);

  // === HELPERS ===
  const isOccupied = useCallback((x: number, y: number, excludeId?: string) => {
    return placed.some((o) => o.grid_x === x && o.grid_y === y && o.id !== excludeId);
  }, [placed]);

  const displayName = accountId.split(".")[0];

  // === QUICKBAR ===
  const selectToQuickbar = useCallback((item: InventoryStack) => {
    setQuickbar((prev) => {
      const filtered = prev.filter((t) => t !== item.item_type);
      return [item.item_type, ...filtered].slice(0, 3);
    });
  }, []);

  // === PLACEMENT ===
  const startPlacing = useCallback((item: InventoryStack) => {
    setPlacingItem(item);
    setMode("placing");
    setSelectedObj(null);
    setInventoryOpen(false);
    setPlayerMenuOpen(false);
    setPreviewPos(null);
  }, []);

  const confirmPlace = useCallback(() => {
    if (!placingItem || !previewPos) return;
    if (isOccupied(previewPos.x, previewPos.y)) return;
    const newObj: PlacedObject = {
      id: uid(), item_type: placingItem.item_type, name: placingItem.name,
      image: placingItem.image, grid_x: previewPos.x, grid_y: previewPos.y,
    };
    setPlaced((p) => [...p, newObj]);
    setInventory((inv) => {
      return inv.map((s) => s.item_type === placingItem.item_type ? { ...s, count: s.count - 1 } : s).filter((s) => s.count > 0);
    });
    setMode("idle");
    setPlacingItem(null);
    setPreviewPos(null);
  }, [placingItem, previewPos, isOccupied]);

  const cancelAction = useCallback(() => {
    setMode("idle");
    setPlacingItem(null);
    setPreviewPos(null);
    setSelectedObj(null);
  }, []);

  // === SELECT PLACED OBJECT ===
  const selectPlacedObj = useCallback((obj: PlacedObject) => {
    if (mode !== "idle") return;
    setSelectedObj(obj);
    setMode("selected");
  }, [mode]);

  const pickupObj = useCallback(() => {
    if (!selectedObj) return;
    setPlaced((p) => p.filter((o) => o.id !== selectedObj.id));
    setInventory((inv) => {
      const ex = inv.find((s) => s.item_type === selectedObj.item_type);
      if (ex) return inv.map((s) => s.item_type === selectedObj.item_type ? { ...s, count: s.count + 1 } : s);
      return [...inv, { item_type: selectedObj.item_type, count: 1, name: selectedObj.name, image: selectedObj.image, tokenIds: [] }];
    });
    setSelectedObj(null);
    setMode("idle");
  }, [selectedObj]);

  const startMoveObj = useCallback(() => {
    if (!selectedObj) return;
    // Remove from placed, start placing
    const item: InventoryStack = { item_type: selectedObj.item_type, count: 1, name: selectedObj.name, image: selectedObj.image, tokenIds: [] };
    setPlaced((p) => p.filter((o) => o.id !== selectedObj.id));
    setPlacingItem(item);
    setMode("placing");
    setSelectedObj(null);
    setPreviewPos(null);
  }, [selectedObj]);

  // === RENDER ===
  const previewValid = previewPos ? !isOccupied(previewPos.x, previewPos.y) : false;

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col relative overflow-hidden">
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2">
        <button onClick={() => { setPlayerMenuOpen(!playerMenuOpen); setInventoryOpen(false); }}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg flex items-center justify-center text-lg border border-white/10">👤</button>
        <button onClick={() => { setInventoryOpen(!inventoryOpen); setPlayerMenuOpen(false); }}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg flex items-center justify-center text-lg border border-white/10">📦</button>
      </div>

      {/* PLAYER MENU */}
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
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />NEAR mainnet
          </div>
          <button onClick={onDisconnect} className="w-full text-xs bg-red-900/50 hover:bg-red-800/70 text-red-300 py-2 rounded-lg">⏏ Отключить</button>
        </div>
      )}

      {/* INVENTORY PANEL */}
      {inventoryOpen && (
        <div className="absolute top-14 right-3 z-30 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 w-72 max-h-[70vh] overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2">📦 Инвентарь ({inventory.reduce((s, i) => s + i.count, 0)})</div>
          {inventory.length === 0 ? (
            <div className="text-gray-600 text-xs py-4 text-center">Нет предметов с &quot;bee&quot; в названии</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {inventory.map((item) => (
                <button key={item.item_type} onClick={() => { selectToQuickbar(item); startPlacing(item); }}
                  className="relative w-14 h-14 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg flex items-center justify-center transition-colors overflow-hidden"
                  title={`${item.name} (${item.count})`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <span className="text-xs text-gray-400 text-center px-0.5 leading-tight">{item.name.slice(0, 12)}</span>
                  )}
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">{item.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUICKBAR */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        {(() => {
          // Only show quickbar items that still exist in inventory
          const activeItems = quickbar
            .map((t) => inventory.find((s) => s.item_type === t))
            .filter((item): item is InventoryStack => !!item && item.count > 0)
            .slice(0, 3);
          if (activeItems.length === 0) return null;
          return activeItems.map((item, i) => (
            <div key={item.item_type}
              className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center backdrop-blur overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => startPlacing(item)}>
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover rounded-md opacity-70" />
              ) : (
                <span className="text-gray-400 text-[8px]">{item.name.slice(0, 6)}</span>
              )}
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                {item.count}
              </span>
            </div>
          ));
        })()}
      </div>

      {/* PLACEMENT / SELECTION BAR */}
      {mode === "placing" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2">
          <span className="text-sm text-yellow-200">📍 {placingItem?.name}</span>
          <button onClick={confirmPlace} disabled={!previewValid}
            className="text-xs bg-green-700 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg">✓ Разместить</button>
          <button onClick={cancelAction} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg">✕ Отмена</button>
        </div>
      )}
      {mode === "selected" && selectedObj && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2">
          <span className="text-sm text-white">{selectedObj.name}</span>
          <button onClick={startMoveObj} className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg">↔ Переместить</button>
          <button onClick={pickupObj} className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg">📥 Убрать</button>
          <button onClick={cancelAction} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg">✕</button>
        </div>
      )}

      {/* GAME FIELD */}
      <div className="flex-1 flex items-center justify-center" onClick={() => { setPlayerMenuOpen(false); setInventoryOpen(false); if (mode === "idle") setSelectedObj(null); }}>
        <div className="relative select-none" style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE, borderRadius: 8, border: "2px solid #2d6b35", overflow: "hidden" }}>
          {/* Grass */}
          {Array.from({ length: GRID_ROWS }, (_, y) =>
            Array.from({ length: GRID_COLS }, (_, x) => (
              <div key={`${x}-${y}`} className="absolute" style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, background: (x + y) % 2 === 0 ? "#3a7d44" : "#358040" }}
                onMouseEnter={() => mode === "placing" && setPreviewPos({ x, y })}
                onClick={(e) => { e.stopPropagation(); if (mode === "placing") confirmPlace(); }}
              />
            ))
          )}

          {/* Placement preview */}
          {mode === "placing" && previewPos && (
            <div className="absolute pointer-events-none border-2 rounded-md flex items-center justify-center overflow-hidden"
              style={{
                left: previewPos.x * CELL_SIZE + 1, top: previewPos.y * CELL_SIZE + 1,
                width: CELL_SIZE - 2, height: CELL_SIZE - 2,
                background: previewValid ? "rgba(0,255,0,0.25)" : "rgba(255,0,0,0.25)",
                borderColor: previewValid ? "#00ff00" : "#ff0000",
                zIndex: 15,
              }}>
              {placingItem?.image && <img src={placingItem.image} alt="" className="w-full h-full object-cover opacity-60" />}
            </div>
          )}

          {/* Grid overlay in placing mode */}
          {mode === "placing" && Array.from({ length: GRID_ROWS }, (_, y) =>
            Array.from({ length: GRID_COLS }, (_, x) => (
              <div key={`g-${x}-${y}`} className="absolute border border-white/5" style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, zIndex: 1 }}
                onMouseEnter={() => setPreviewPos({ x, y })}
                onClick={(e) => { e.stopPropagation(); setPreviewPos({ x, y }); confirmPlace(); }}
              />
            ))
          )}

          {/* Placed objects */}
          {placed.map((obj) => {
            const isSel = selectedObj?.id === obj.id;
            return (
              <div key={obj.id} className="absolute cursor-pointer transition-transform hover:scale-105 overflow-hidden rounded-md"
                style={{
                  left: obj.grid_x * CELL_SIZE + 2, top: obj.grid_y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4, height: CELL_SIZE - 4,
                  border: isSel ? "2px solid #ffd700" : "1px solid rgba(0,0,0,0.3)",
                  boxShadow: isSel ? "0 0 10px #ffd700" : "0 1px 3px rgba(0,0,0,0.4)",
                  zIndex: 5 + obj.grid_y,
                }}
                onClick={(e) => { e.stopPropagation(); selectPlacedObj(obj); }}>
                {obj.image ? (
                  <img src={obj.image} alt={obj.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400">{obj.name.slice(0, 8)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
