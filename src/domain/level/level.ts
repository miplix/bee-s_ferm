import { LEVEL_EXPERIENCE, MAX_BUMPKIN_LEVEL } from "./xpTable";

/** Get current Bumpkin level for a given XP total. */
export function getLevel(xp: number): number {
  for (let i = LEVEL_EXPERIENCE.length - 1; i >= 1; i--) {
    if (xp >= LEVEL_EXPERIENCE[i]) return i;
  }
  return 1;
}

/** XP required to reach the next level. Returns Infinity if max. */
export function xpForNext(level: number): number {
  if (level >= MAX_BUMPKIN_LEVEL) return Infinity;
  return LEVEL_EXPERIENCE[level + 1];
}

/** Progress ratio [0,1) toward next level. */
export function xpProgress(xp: number): number {
  const level = getLevel(xp);
  if (level >= MAX_BUMPKIN_LEVEL) return 1;
  const current = LEVEL_EXPERIENCE[level];
  const next = LEVEL_EXPERIENCE[level + 1];
  return (xp - current) / (next - current);
}
