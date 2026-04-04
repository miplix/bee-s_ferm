"use client";

import { useState } from "react";
import { getPlayerFarm } from "@/lib/db";
import type { Player, PlacedObject } from "@/types";

interface Props {
  onClose: () => void;
  onVisit: (player: Player, objects: PlacedObject[]) => void;
}

export default function VisitModal({ onClose, onVisit }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVisit() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { player, objects } = await getPlayerFarm(input.trim());
      if (!player) {
        setError("Игрок не найден");
        return;
      }
      onVisit(player, objects);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 rounded-xl p-6 w-96 border border-gray-700">
        <h2 className="text-lg mb-4">🏠 Зайти в гости</h2>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVisit()}
          placeholder="account_id (например: player.near)"
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm mb-3"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            Отмена
          </button>
          <button onClick={handleVisit} disabled={loading} className="text-sm px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">
            {loading ? "..." : "Посетить"}
          </button>
        </div>
      </div>
    </div>
  );
}
