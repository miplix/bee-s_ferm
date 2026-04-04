"use client";

import { useEffect, useState, useRef } from "react";
import { ITEM_DEFS, CELL_SIZE } from "@/game/config";
import type { PlacedObject } from "@/types";

interface Props {
  object: PlacedObject;
  onComplete: () => void;
  onCancel: () => void;
}

export default function DestroyProgress({ object, onComplete, onCancel }: Props) {
  const def = ITEM_DEFS[object.object_type];
  const totalTime = def?.destroyTime || 3000;
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / totalTime) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [totalTime, onComplete]);

  return (
    <div
      className="absolute z-50 flex flex-col items-center gap-2"
      style={{
        left: object.grid_x * CELL_SIZE - 20,
        top: object.grid_y * CELL_SIZE - 40,
        width: CELL_SIZE + 40,
      }}
    >
      <div className="text-xs text-white font-bold bg-black/70 px-2 py-1 rounded">
        ⛏️ {def?.name}...
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={onCancel}
        className="text-xs text-gray-400 hover:text-white bg-gray-800/80 px-3 py-1 rounded"
      >
        Отмена
      </button>
    </div>
  );
}
