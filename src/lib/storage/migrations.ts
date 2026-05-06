import type { GameState } from "../../domain/types/game";
import { createInitialState } from "../../domain/types/game";
import { CURRENT_VERSION } from "./schemaVersion";

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, Migration> = {
  2: (raw) => ({
    ...raw,
    petStates: raw["petStates"] ?? {},
  }),
  // v3: убирали мутанты — чистили legacy mutant_* items из инвентаря (потом вернули)
  3: (raw) => {
    const inv = (raw["inventory"] ?? {}) as Record<string, number>;
    const cleaned: Record<string, number> = {};
    for (const [id, qty] of Object.entries(inv)) {
      if (!id.startsWith("mutant_")) cleaned[id] = qty;
    }
    return { ...raw, inventory: cleaned };
  },
  // v4: вернули мутантов — добавляем placedMutants: [] (пустой)
  4: (raw) => ({
    ...raw,
    placedMutants: raw["placedMutants"] ?? [],
  }),
};

export function migrate(raw: unknown): GameState {
  if (!raw || typeof raw !== "object") return createInitialState();

  const obj = raw as Record<string, unknown>;
  let version = typeof obj.version === "number" ? obj.version : 0;

  if (version === 0) return createInitialState();

  while (version < CURRENT_VERSION) {
    const next = version + 1;
    const fn = migrations[next];
    if (!fn) return createInitialState(); // missing migration → fresh start
    const result = fn(obj);
    Object.assign(obj, result);
    obj.version = next;
    version = next;
  }

  return obj as unknown as GameState;
}
