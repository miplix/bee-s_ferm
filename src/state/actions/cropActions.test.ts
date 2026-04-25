import { describe, it, expect } from "vitest";
import { plant, harvest } from "./cropActions";
import { createInitialState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";

const NOW = 1_700_000_000_000;

function base() {
  const s = createInitialState();
  // Give seeds and find a free plot
  s.inventory["sunflower_seed"] = 5;
  s.inventory["carrot_seed"] = 5;
  return s;
}

/** Find first empty plot in state */
function firstPlot(s: ReturnType<typeof createInitialState>) {
  for (const [key, cell] of Object.entries(s.cells)) {
    if (cell.type === "plot" && !cell.cropId) {
      const [cx, cy] = key.split(",").map(Number);
      return { cx, cy };
    }
  }
  throw new Error("no free plot");
}

describe("plant", () => {
  it("посадка снимает 1 семя", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const next = plant(s, cx, cy, "sunflower", NOW);
    expect(next.inventory["sunflower_seed"]).toBe(4);
    expect(next.cells[cellKey(cx, cy)].cropId).toBe("sunflower");
  });

  it("no-op если нет семян", () => {
    const s = base();
    s.inventory["sunflower_seed"] = 0;
    delete s.inventory["sunflower_seed"];
    const { cx, cy } = firstPlot(s);
    const next = plant(s, cx, cy, "sunflower", NOW);
    expect(next).toBe(s);
  });

  it("no-op если клетка уже занята", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const planted = plant(s, cx, cy, "sunflower", NOW);
    const again = plant(planted, cx, cy, "sunflower", NOW - 1);
    expect(again).toBe(planted);
  });

  it("no-op если недостаточный уровень", () => {
    const s = base();
    s.inventory["kale_seed"] = 3;
    // kale требует уровень 9, у нас xp=0
    const { cx, cy } = firstPlot(s);
    const next = plant(s, cx, cy, "kale", NOW);
    expect(next).toBe(s);
  });

  it("сохраняет effectiveGrowMs в клетке", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const next = plant(s, cx, cy, "sunflower", NOW);
    const cell = next.cells[cellKey(cx, cy)];
    expect(cell.effectiveGrowMs).toBeGreaterThan(0);
  });
});

describe("harvest", () => {
  it("урожай после готовности", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const planted = plant(s, cx, cy, "sunflower", NOW);
    // sunflower growMs = 60_000
    const later = NOW + 61_000;
    const harvested = harvest(planted, cx, cy, later);
    expect(harvested.inventory["sunflower"]).toBeGreaterThanOrEqual(1);
    expect(harvested.cells[cellKey(cx, cy)].cropId).toBeNull();
  });

  it("no-op если ещё не готово", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const planted = plant(s, cx, cy, "sunflower", NOW);
    const tooSoon = harvest(planted, cx, cy, NOW + 1000);
    expect(tooSoon).toBe(planted);
  });

  it("no-op если нет посева", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const result = harvest(s, cx, cy, NOW);
    expect(result).toBe(s);
  });

  it("очищает клетку после сбора", () => {
    const s = base();
    const { cx, cy } = firstPlot(s);
    const planted = plant(s, cx, cy, "sunflower", NOW);
    const harvested = harvest(planted, cx, cy, NOW + 61_000);
    const cell = harvested.cells[cellKey(cx, cy)];
    expect(cell.cropId).toBeNull();
    expect(cell.plantedAt).toBeNull();
    expect(cell.effectiveGrowMs).toBeNull();
  });
});
