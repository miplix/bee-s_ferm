import { describe, expect, test } from "vitest";
import { mulberry32, chance, range, randInt, pick } from "./prng";

describe("mulberry32", () => {
  test("same seed → same sequence", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  test("different seeds → different first value", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  test("returns values in [0, 1)", () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("chance", () => {
  test("p=0 → always false", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 20; i++) expect(chance(rng, 0)).toBe(false);
  });

  test("p=1 → always true", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 20; i++) expect(chance(rng, 1)).toBe(true);
  });
});

describe("randInt", () => {
  test("always in [min, max] inclusive", () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 200; i++) {
      const v = randInt(rng, 3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  test("min === max → always returns that value", () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 10; i++) expect(randInt(rng, 5, 5)).toBe(5);
  });
});

describe("range", () => {
  test("returns value in [min, max)", () => {
    const rng = mulberry32(77);
    for (let i = 0; i < 100; i++) {
      const v = range(rng, 10, 20);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThan(20);
    }
  });
});

describe("pick", () => {
  test("always picks an element from the array", () => {
    const rng = mulberry32(55);
    const arr = ["a", "b", "c", "d"] as const;
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(pick(rng, arr));
    }
  });
});
