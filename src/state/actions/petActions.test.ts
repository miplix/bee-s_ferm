import { describe, it, expect } from "vitest";
import { adoptPet, napPet, feedPet } from "./petActions";
import { createInitialState } from "../../domain/types/game";
import { PET_XP_PER_NAP, PET_FEED_XP, PET_NAP_COOLDOWN_MS } from "../../data/pets.data";

const NOW = 1_700_000_000_000;

function baseState() {
  return {
    ...createInitialState(),
    island: "spring" as const,
    buildings: ["workbench", "market", "campfire", "pet_house"] as any[],
  };
}

describe("adoptPet", () => {
  it("добавляет питомца при наличии Pet House", () => {
    const s = baseState();
    const next = adoptPet(s, "farm_dog", NOW);
    expect(next.pets).toContain("farm_dog");
    expect(next.petStates["farm_dog"]).toBeDefined();
    expect(next.petStates["farm_dog"].xp).toBe(0);
  });

  it("отказывает без Pet House", () => {
    const s = { ...createInitialState(), buildings: ["workbench", "market"] as any[] };
    const next = adoptPet(s, "farm_dog", NOW);
    expect(next).toBe(s);
  });

  it("нет-оп если питомец уже есть", () => {
    const s = { ...baseState(), pets: ["farm_dog"] };
    const next = adoptPet(s, "farm_dog", NOW);
    expect(next).toBe(s);
  });

  it("нет-оп для несуществующего petId", () => {
    const s = baseState();
    const next = adoptPet(s, "unknown_pet", NOW);
    expect(next).toBe(s);
  });
});

describe("napPet", () => {
  it("даёт XP при готовом кулдауне", () => {
    const s = adoptPet(baseState(), "farm_dog", NOW - PET_NAP_COOLDOWN_MS - 1);
    const next = napPet(s, "farm_dog", NOW);
    expect(next.petStates["farm_dog"].xp).toBe(PET_XP_PER_NAP);
    expect(next.petStates["farm_dog"].lastNap).toBe(NOW);
  });

  it("нет-оп если кулдаун не прошёл", () => {
    const adopted = adoptPet(baseState(), "farm_dog", NOW);
    const afterNap = napPet(adopted, "farm_dog", NOW); // первый сон сразу доступен (lastNap=0)
    const tooSoon = napPet(afterNap, "farm_dog", NOW + 1000);
    expect(tooSoon).toBe(afterNap);
  });

  it("нет-оп для чужого питомца", () => {
    const s = baseState();
    const next = napPet(s, "farm_dog", NOW);
    expect(next).toBe(s);
  });
});

describe("feedPet", () => {
  it("кормит и даёт XP за пшеницу", () => {
    const adopted = adoptPet(baseState(), "farm_dog", NOW);
    const s = { ...adopted, inventory: { wheat: 3 } };
    const next = feedPet(s, "farm_dog", NOW);
    expect(next.petStates["farm_dog"].xp).toBe(PET_FEED_XP);
    expect(next.inventory["wheat"]).toBe(2);
  });

  it("нет-оп без пшеницы", () => {
    const s = adoptPet(baseState(), "farm_dog", NOW);
    const next = feedPet(s, "farm_dog", NOW);
    expect(next).toBe(s);
  });

  it("удаляет ключ wheat из inventory если стало 0", () => {
    const adopted = adoptPet(baseState(), "farm_dog", NOW);
    const s = { ...adopted, inventory: { wheat: 1 } };
    const next = feedPet(s, "farm_dog", NOW);
    expect("wheat" in next.inventory).toBe(false);
  });
});
