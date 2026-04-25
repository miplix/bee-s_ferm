import { describe, it, expect } from "vitest";
import { cureAnimal } from "./animalActions";
import type { GameState, AnimalState } from "../../domain/types/game";
import { createInitialState } from "../../domain/types/game";

function makeAnimal(diseased: boolean): AnimalState {
  return {
    id: "a1",
    kind: "chicken",
    xp: 0,
    bornAt: 0,
    lastFed: 0,
    lastCollect: 0,
    diseased,
  };
}

function stateWith(animal: AnimalState, inv: Record<string, number>): GameState {
  return { ...createInitialState(), animals: [animal], inventory: inv };
}

describe("cureAnimal", () => {
  it("лечит животное и списывает lemon + honey", () => {
    const s = stateWith(makeAnimal(true), { lemon: 2, honey: 3 });
    const next = cureAnimal(s, "a1");
    expect(next.animals[0].diseased).toBe(false);
    expect(next.inventory["lemon"]).toBe(1);
    expect(next.inventory["honey"]).toBe(2);
  });

  it("не лечит если нет lemon", () => {
    const s = stateWith(makeAnimal(true), { honey: 5 });
    const next = cureAnimal(s, "a1");
    expect(next).toBe(s);
  });

  it("не лечит если нет honey", () => {
    const s = stateWith(makeAnimal(true), { lemon: 5 });
    const next = cureAnimal(s, "a1");
    expect(next).toBe(s);
  });

  it("нет-оп для здорового животного", () => {
    const s = stateWith(makeAnimal(false), { lemon: 5, honey: 5 });
    const next = cureAnimal(s, "a1");
    expect(next).toBe(s);
  });

  it("нет-оп для несуществующего ID", () => {
    const s = stateWith(makeAnimal(true), { lemon: 5, honey: 5 });
    const next = cureAnimal(s, "wrong");
    expect(next).toBe(s);
  });

  it("удаляет ключ из inventory если стало 0", () => {
    const s = stateWith(makeAnimal(true), { lemon: 1, honey: 1 });
    const next = cureAnimal(s, "a1");
    expect("lemon" in next.inventory).toBe(false);
    expect("honey" in next.inventory).toBe(false);
  });
});
