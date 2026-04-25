import { describe, it, expect } from "vitest";
import { upgradeBeehive, accruePassivePollen } from "./beehiveActions";
import type { GameState, BeehiveState } from "../../domain/types/game";
import { createInitialState } from "../../domain/types/game";
import { BEEHIVE_LEVELS } from "../../data/beehives.data";

const NOW = 1_700_000_000_000;

function makeHive(level: number): BeehiveState {
  return {
    id: "hive-1",
    level,
    actions: 0,
    lastAction: 0,
    createdAt: NOW,
    accruedPollen: 0,
    lastAccrualAt: NOW,
  };
}

function stateWith(hive: BeehiveState, pollen: number): GameState {
  const base = createInitialState();
  return { ...base, island: "spring", beehives: [hive], pollen };
}

describe("upgradeBeehive", () => {
  it("upgrades Lv1 → Lv2 when pollen is enough", () => {
    const cost = BEEHIVE_LEVELS[2].upgradeCost; // 5000
    const s = stateWith(makeHive(1), cost);
    const next = upgradeBeehive(s, "hive-1", NOW);
    expect(next.beehives[0].level).toBe(2);
    expect(next.pollen).toBeCloseTo(0);
  });

  it("upgrades Lv2 → Lv3 when pollen is enough", () => {
    const cost = BEEHIVE_LEVELS[3].upgradeCost; // 20000
    const s = stateWith(makeHive(2), cost + 100);
    const next = upgradeBeehive(s, "hive-2", NOW); // wrong id
    expect(next).toBe(s); // no-op

    const next2 = upgradeBeehive(s, "hive-1", NOW);
    expect(next2.beehives[0].level).toBe(3);
    expect(next2.pollen).toBeCloseTo(100);
  });

  it("rejects upgrade when pollen insufficient", () => {
    const s = stateWith(makeHive(1), 100);
    const next = upgradeBeehive(s, "hive-1", NOW);
    expect(next).toBe(s);
  });

  it("rejects upgrade for demo hive (level 0)", () => {
    const s = stateWith(makeHive(0), 99999);
    const next = upgradeBeehive(s, "hive-1", NOW);
    expect(next).toBe(s);
  });

  it("rejects upgrade for max level hive (level 3)", () => {
    const s = stateWith(makeHive(3), 99999);
    const next = upgradeBeehive(s, "hive-1", NOW);
    expect(next).toBe(s);
  });
});

describe("accruePassivePollen", () => {
  it("accrues correct pollen for Lv1 hive over 1 day", () => {
    const hive = makeHive(1);
    const s = stateWith(hive, 0);
    const oneDayLater = NOW + 86_400_000;
    const next = accruePassivePollen(s, oneDayLater);
    expect(next.pollen).toBeCloseTo(BEEHIVE_LEVELS[1].pollenPerDay); // 5
  });

  it("accrues correct pollen for Lv2 hive over 1 day", () => {
    const hive = makeHive(2);
    const s = stateWith(hive, 0);
    const next = accruePassivePollen(s, NOW + 86_400_000);
    expect(next.pollen).toBeCloseTo(BEEHIVE_LEVELS[2].pollenPerDay); // 12
  });

  it("accrues correct pollen for Lv3 hive over 1 day", () => {
    const hive = makeHive(3);
    const s = stateWith(hive, 0);
    const next = accruePassivePollen(s, NOW + 86_400_000);
    expect(next.pollen).toBeCloseTo(BEEHIVE_LEVELS[3].pollenPerDay); // 30
  });

  it("returns same state if no time elapsed", () => {
    const s = stateWith(makeHive(1), 0);
    const next = accruePassivePollen(s, NOW);
    expect(next).toBe(s);
  });
});
