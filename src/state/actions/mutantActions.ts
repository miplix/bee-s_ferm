import type { GameState } from "../../domain/types/game";
import { isMutantId } from "../../domain/mutants/mutants";

/**
 * Поставить мутанта на ферму. Списывает 1 шт. из инвентаря, добавляет в placedMutants.
 * Бонусы (+10% к родительской культуре/животному) активируются только когда placed.
 */
export function placeMutant(state: GameState, mutantId: string): GameState {
  if (!isMutantId(mutantId)) return state;
  const have = state.inventory[mutantId] ?? 0;
  if (have < 1) return state;

  const inv = { ...state.inventory };
  inv[mutantId] = have - 1;
  if (inv[mutantId]! <= 0) delete inv[mutantId];

  return {
    ...state,
    inventory: inv,
    placedMutants: [...(state.placedMutants ?? []), mutantId],
  };
}

/**
 * Снять одного мутанта с фермы (возвращает в инвентарь).
 * Если на ферме несколько одинаковых — снимаем один экземпляр.
 */
export function unplaceMutant(state: GameState, mutantId: string): GameState {
  if (!isMutantId(mutantId)) return state;
  const placed = state.placedMutants ?? [];
  const idx = placed.indexOf(mutantId);
  if (idx < 0) return state;

  const newPlaced = [...placed.slice(0, idx), ...placed.slice(idx + 1)];
  const inv = { ...state.inventory };
  inv[mutantId] = (inv[mutantId] ?? 0) + 1;

  return {
    ...state,
    inventory: inv,
    placedMutants: newPlaced,
  };
}
