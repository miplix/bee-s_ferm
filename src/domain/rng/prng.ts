/** Seeded PRNG — mulberry32 algorithm. Returns [0, 1). */
export type PRNG = () => number;

export function mulberry32(seed: number): PRNG {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns true with probability p ∈ [0, 1]. */
export const chance = (rng: PRNG, p: number): boolean => rng() < p;

/** Returns a float in [min, max). */
export const range = (rng: PRNG, min: number, max: number): number =>
  min + (max - min) * rng();

/** Returns an integer in [min, max] (inclusive). */
export const randInt = (rng: PRNG, min: number, max: number): number =>
  Math.floor(rng() * (max - min + 1)) + min;

/** Picks a random element from a readonly array. */
export const pick = <T>(rng: PRNG, xs: readonly T[]): T =>
  xs[Math.floor(rng() * xs.length)];
