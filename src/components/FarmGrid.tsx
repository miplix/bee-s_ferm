"use client";

import { useState, useCallback, useEffect } from "react";
import { GRID_COLS, GRID_ROWS, CELL_SIZE, ITEM_DEFS, CROP_DEFS } from "@/game/config";
import type { PlacedObject, DroppedResource } from "@/types";

interface Props {
  objects: PlacedObject[];
  drops: DroppedResource[];
  mode: string;
  selectedItem: string | null;
  selectedObject: PlacedObject | null;
  onCellClick: (x: number, y: number) => void;
  onObjectClick: (obj: PlacedObject) => void;
  onDropClick: (drop: DroppedResource) => void;
}

function getCropStage(obj: PlacedObject): string | null {
  if (!obj.crop || !obj.plantedAt || !obj.growthDuration) return null;
  const cropDef = CROP_DEFS[obj.crop];
  if (!cropDef) return null;
  const elapsed = Date.now() - obj.plantedAt;
  const progress = Math.min(1, elapsed / obj.growthDuration);
  const stageIdx = Math.min(cropDef.stages.length - 1, Math.floor(progress * cropDef.stages.length));
  return cropDef.stages[stageIdx];
}

function isReady(obj: PlacedObject): boolean {
  if (!obj.crop || !obj.plantedAt || !obj.growthDuration) return false;
  return Date.now() - obj.plantedAt >= obj.growthDuration;
}

export default function FarmGrid({ objects, drops, mode, selectedItem, selectedObject, onCellClick, onObjectClick, onDropClick }: Props) {
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const [, setTick] = useState(0);

  // Re-render every second to update crop growth
  useEffect(() => {
    const hasCrops = objects.some((o) => o.crop);
    if (!hasCrops) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [objects]);

  const isOccupied = useCallback((x: number, y: number) => {
    return objects.some((o) => o.grid_x === x && o.grid_y === y && o.id !== selectedObject?.id);
  }, [objects, selectedObject]);

  const showGrid = mode === "placing" || mode === "moving";

  return (
    <div className="relative select-none" style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE, background: "#3a7d44", borderRadius: 8, border: "2px solid #2d6b35" }}>
      {/* Grass */}
      {Array.from({ length: GRID_ROWS }, (_, y) =>
        Array.from({ length: GRID_COLS }, (_, x) => (
          <div key={`g-${x}-${y}`} className="absolute" style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, background: (x + y) % 2 === 0 ? "#3a7d44" : "#358040" }} />
        ))
      )}

      {/* Grid overlay */}
      {showGrid && Array.from({ length: GRID_ROWS }, (_, y) =>
        Array.from({ length: GRID_COLS }, (_, x) => {
          const occ = isOccupied(x, y);
          const hover = hoverCell?.x === x && hoverCell?.y === y;
          return (
            <div key={`c-${x}-${y}`} className="absolute border border-white/10"
              style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, background: hover ? (occ ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)") : "transparent", cursor: occ ? "not-allowed" : "pointer", zIndex: 2 }}
              onMouseEnter={() => setHoverCell({ x, y })} onMouseLeave={() => setHoverCell(null)}
              onClick={() => !occ && onCellClick(x, y)} />
          );
        })
      )}

      {/* Objects */}
      {objects.map((obj) => {
        const def = ITEM_DEFS[obj.object_type];
        if (!def) return null;
        const isSel = selectedObject?.id === obj.id;
        const isFieldWithCrop = def.isField && obj.crop;
        const cropStage = getCropStage(obj);
        const ready = isReady(obj);
        const cropDef = obj.crop ? CROP_DEFS[obj.crop] : null;

        // Progress bar for growing crops
        let progressPct = 0;
        if (obj.crop && obj.plantedAt && obj.growthDuration) {
          progressPct = Math.min(100, ((Date.now() - obj.plantedAt) / obj.growthDuration) * 100);
        }

        return (
          <div key={obj.id} className="absolute flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
            style={{
              left: obj.grid_x * CELL_SIZE + 2, top: obj.grid_y * CELL_SIZE + 2,
              width: CELL_SIZE - 4, height: CELL_SIZE - 4,
              background: def.isField ? "#5c3a1e" : def.color + "cc",
              borderRadius: 8,
              border: isSel ? "3px solid #ffd700" : ready ? "2px solid #00ff00" : "2px solid rgba(0,0,0,0.2)",
              fontSize: isFieldWithCrop ? CELL_SIZE * 0.4 : CELL_SIZE * 0.5,
              zIndex: 5 + obj.grid_y,
              boxShadow: isSel ? "0 0 12px #ffd700" : ready ? "0 0 8px #00ff00" : "0 2px 4px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => { e.stopPropagation(); if (mode === "idle" || mode === "destroying") onObjectClick(obj); }}
          >
            {isFieldWithCrop ? (
              <>
                <span>{cropStage}</span>
                {!ready && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 rounded-b-md overflow-hidden">
                    <div className="h-full bg-green-400 transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                )}
                {ready && <span className="absolute -top-1 -right-1 text-xs">✅</span>}
              </>
            ) : (
              <span>{def.emoji}</span>
            )}
            {def.isField && !obj.crop && <span className="text-[9px] text-amber-200/70 absolute bottom-0.5">грядка</span>}
          </div>
        );
      })}

      {/* Drops */}
      {drops.map((drop) => {
        const res = { wood: "🪵", stone: "🪨", gold: "🪙", berry: "🫐" }[drop.resource_type] || "📦";
        return (
          <div key={drop.id} className="absolute flex items-center justify-center cursor-pointer animate-bounce"
            style={{ left: drop.grid_x * CELL_SIZE + 8, top: drop.grid_y * CELL_SIZE + 8, width: CELL_SIZE - 16, height: CELL_SIZE - 16, background: "rgba(255,255,255,0.9)", borderRadius: "50%", fontSize: CELL_SIZE * 0.35, zIndex: 10, border: "2px solid #ffd700" }}
            onClick={(e) => { e.stopPropagation(); onDropClick(drop); }}
          >
            <span>{res}</span>
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{drop.amount}</span>
          </div>
        );
      })}
    </div>
  );
}
