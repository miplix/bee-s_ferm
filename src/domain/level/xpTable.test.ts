import { describe, expect, test } from "vitest";
import { LEVEL_EXPERIENCE, MAX_BUMPKIN_LEVEL } from "./xpTable";
import { getLevel, xpForNext, xpProgress } from "./level";

describe("LEVEL_EXPERIENCE table", () => {
  test("has 201 entries (index 0 unused + levels 1-200)", () => {
    expect(LEVEL_EXPERIENCE.length).toBe(201);
  });

  test("level 1 requires 0 XP", () => {
    expect(LEVEL_EXPERIENCE[1]).toBe(0);
  });

  test("XP is monotonically increasing", () => {
    for (let i = 2; i <= MAX_BUMPKIN_LEVEL; i++) {
      expect(LEVEL_EXPERIENCE[i]).toBeGreaterThan(LEVEL_EXPERIENCE[i - 1]);
    }
  });
});

describe("getLevel", () => {
  test("0 XP → level 1", () => {
    expect(getLevel(0)).toBe(1);
  });

  test("69 XP → still level 1", () => {
    expect(getLevel(69)).toBe(1);
  });

  test("70 XP → level 2", () => {
    expect(getLevel(70)).toBe(2);
  });

  test("exactly at level 10 threshold", () => {
    expect(getLevel(LEVEL_EXPERIENCE[10])).toBe(10);
  });

  test("max XP → level 200", () => {
    expect(getLevel(LEVEL_EXPERIENCE[200])).toBe(MAX_BUMPKIN_LEVEL);
  });

  test("huge XP capped at max level", () => {
    expect(getLevel(999_999_999)).toBe(MAX_BUMPKIN_LEVEL);
  });
});

describe("xpProgress", () => {
  test("at level boundary → 0 progress", () => {
    expect(xpProgress(LEVEL_EXPERIENCE[5])).toBe(0);
  });

  test("halfway between level 5 and 6 → ~0.5", () => {
    const mid = Math.floor((LEVEL_EXPERIENCE[5] + LEVEL_EXPERIENCE[6]) / 2);
    expect(xpProgress(mid)).toBeGreaterThan(0.4);
    expect(xpProgress(mid)).toBeLessThan(0.6);
  });

  test("at max level → 1", () => {
    expect(xpProgress(LEVEL_EXPERIENCE[200])).toBe(1);
  });
});

describe("xpForNext", () => {
  test("level 1 → threshold of level 2", () => {
    expect(xpForNext(1)).toBe(LEVEL_EXPERIENCE[2]);
  });

  test("max level → Infinity", () => {
    expect(xpForNext(MAX_BUMPKIN_LEVEL)).toBe(Infinity);
  });
});
