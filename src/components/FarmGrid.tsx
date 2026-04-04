"use client";

import { useState, useCallback } from "react";
import { GRID_COLS, GRID_ROWS, CELL_SIZE, ITEM_DEFS, RESOURCE_DEFS } from "@/game/config";
import type { PlacedObject, DroppedResource } from "@/types";

interface Props {
  objects: PlacedObject[];
  drops: DroppedResource[];
  mode: "idle" | "placing" | "moving" | "destroying";
  selectedItem: string | null;
  selectedObject: PlacedObject | null;
  onCellClick: (x: number, y: number) => void;
  onObjectClick: (obj: PlacedObject) => void;
  onDropClick: (drop: DroppedResource) => void;
}

export default function FarmGrid({
  objects, drops, mode, selectedItem, selectedObject,
  onCellClick, onObjectClick, onDropClick,
}: Props) {
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);

  const isOccupied = useCallback((x: number, y: number) => {
    return objects.some((o) => o.grid_x === x && o.grid_y === y &&
      o.id !== selectedObject?.id);
  }, [objects, selectedObject]);

  const showGrid = mode === "placing" || mode === "moving";

  return (
    <div
      className="relative select-none overflow-auto"
      style={{
        width: GRID_COLS * CELL_SIZE,
        height: GRID_ROWS * CELL_SIZE,
        background: "#3a7d44",
        borderRadius: 8,
        border: "2px solid #2d6b35",
      }}
    >
      {/* Grid cells */}
      {showGrid && Array.from({ length: GRID_ROWS }, (_, y) =>
        Array.from({ length: GRID_COLS }, (_, x) => {
          const occupied = isOccupied(x, y);
          const isHover = hoverCell?.x === x && hoverCell?.y === y;
          let bg = "transparent";
          if (isHover) {
            bg = occupied ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)";
          }
          return (
            <div
              key={`cell-${x}-${y}`}
              className="absolute border border-white/10"
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: bg,
                cursor: occupied ? "not-allowed" : "pointer",
                zIndex: 1,
              }}
              onMouseEnter={() => setHoverCell({ x, y })}
              onMouseLeave={() => setHoverCell(null)}
              onClick={() => !occupied && onCellClick(x, y)}
            />
          );
        })
      )}

      {/* Grass pattern */}
      {Array.from({ length: GRID_ROWS }, (_, y) =>
        Array.from({ length: GRID_COLS }, (_, x) => {
          const shade = (x + y) % 2 === 0 ? "#3a7d44" : "#358040";
          return (
            <div
              key={`grass-${x}-${y}`}
              className="absolute"
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: shade,
              }}
            />
          );
        })
      )}

      {/* Placed objects */}
      {objects.map((obj) => {
        const def = ITEM_DEFS[obj.object_type];
        if (!def) return null;
        const isSelected = selectedObject?.id === obj.id;
        return (
          <div
            key={obj.id}
            className="absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
            style={{
              left: obj.grid_x * CELL_SIZE + 2,
              top: obj.grid_y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              background: def.color + "cc",
              borderRadius: 8,
              border: isSelected ? "3px solid #ffd700" : "2px solid rgba(0,0,0,0.2)",
              fontSize: CELL_SIZE * 0.5,
              zIndex: 5 + obj.grid_y,
              boxShadow: isSelected ? "0 0 12px #ffd700" : "0 2px 4px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "idle" || mode === "destroying") onObjectClick(obj);
            }}
          >
            {def.emoji}
          </div>
        );
      })}

      {/* Dropped resources */}
      {drops.map((drop) => {
        const res = RESOURCE_DEFS[drop.resource_type];
        return (
          <div
            key={drop.id}
            className="absolute flex items-center justify-center cursor-pointer animate-bounce"
            style={{
              left: drop.grid_x * CELL_SIZE + 8,
              top: drop.grid_y * CELL_SIZE + 8,
              width: CELL_SIZE - 16,
              height: CELL_SIZE - 16,
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              fontSize: CELL_SIZE * 0.35,
              zIndex: 10,
              border: "2px solid #ffd700",
              boxShadow: "0 0 8px rgba(255,215,0,0.5)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDropClick(drop);
            }}
          >
            <span>{res?.emoji || "📦"}</span>
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {drop.amount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
