/** FNV-1a hash → 32-bit unsigned int. Used as PRNG seed. */
function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Build a deterministic seed for a game action.
 *
 * @param userSeed - per-save unique seed (uuid)
 * @param timeBucket - epoch-day or other time bucket (ensures same result within bucket)
 * @param actionId - unique action identifier (e.g. "disease:chicken-uuid")
 */
export function buildSeed(
  userSeed: string,
  timeBucket: number,
  actionId: string,
): number {
  return fnv1a(`${userSeed}|${timeBucket}|${actionId}`);
}

/** Returns the epoch-day number for a given ms timestamp. */
export function dayBucket(ms: number): number {
  return Math.floor(ms / 86_400_000);
}
