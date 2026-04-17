import {
  SKILLS,
  TIER_PREREQS,
  getSkillDef,
  type BoostEffect,
  type BoostEffectType,
  type SkillTree,
} from "../../data/skills.data";
import { getLevel } from "../level/level";

// ── Points ──

/** Total skill points earned (1 per level, level 1 gives 0). */
export function getTotalSkillPoints(level: number): number {
  return Math.max(0, level - 1);
}

/** Total points spent across all learned skills. */
export function getSpentSkillPoints(skills: Record<string, boolean>): number {
  let spent = 0;
  for (const id of Object.keys(skills)) {
    if (!skills[id]) continue;
    const def = getSkillDef(id);
    if (def) spent += def.pointCost;
  }
  return spent;
}

/** Unspent skill points available. */
export function getAvailableSkillPoints(
  level: number,
  skills: Record<string, boolean>,
): number {
  return getTotalSkillPoints(level) - getSpentSkillPoints(skills);
}

// ── Points spent in a specific tree ──

export function getPointsSpentInTree(
  tree: SkillTree,
  skills: Record<string, boolean>,
): number {
  let spent = 0;
  for (const id of Object.keys(skills)) {
    if (!skills[id]) continue;
    const def = getSkillDef(id);
    if (def && def.tree === tree) spent += def.pointCost;
  }
  return spent;
}

// ── Can learn ──

export function canLearnSkill(
  skillId: string,
  skills: Record<string, boolean>,
  level: number,
): boolean {
  // Already learned
  if (skills[skillId]) return false;

  const def = getSkillDef(skillId);
  if (!def) return false;

  // Enough unspent points?
  const available = getAvailableSkillPoints(level, skills);
  if (available < def.pointCost) return false;

  // Tier prereq: enough points spent in this tree?
  const spentInTree = getPointsSpentInTree(def.tree, skills);
  const prereq = TIER_PREREQS[def.tier] ?? 0;
  if (spentInTree < prereq) return false;

  return true;
}

// ── Tier unlocked check ──

export function isTierUnlocked(
  tree: SkillTree,
  tier: 1 | 2 | 3,
  skills: Record<string, boolean>,
): boolean {
  const spentInTree = getPointsSpentInTree(tree, skills);
  const prereq = TIER_PREREQS[tier] ?? 0;
  return spentInTree >= prereq;
}

export function pointsNeededForTier(
  tree: SkillTree,
  tier: 1 | 2 | 3,
  skills: Record<string, boolean>,
): number {
  const spentInTree = getPointsSpentInTree(tree, skills);
  const prereq = TIER_PREREQS[tier] ?? 0;
  return Math.max(0, prereq - spentInTree);
}

// ── Aggregate boosts ──

/** Collect all active boost effects from learned skills. */
export function getActiveBoosts(
  skills: Record<string, boolean>,
): BoostEffect[] {
  const boosts: BoostEffect[] = [];
  for (const id of Object.keys(skills)) {
    if (!skills[id]) continue;
    const def = getSkillDef(id);
    if (def) boosts.push(...def.effects);
  }
  return boosts;
}

/** Sum all boosts of a given type (optionally filtered by target). */
export function sumBoost(
  skills: Record<string, boolean>,
  type: BoostEffectType,
  target?: string | null,
): number {
  const boosts = getActiveBoosts(skills);
  let total = 0;
  for (const b of boosts) {
    if (b.type !== type) continue;
    if (target !== undefined && b.target !== null && b.target !== target) continue;
    total += b.value;
  }
  return total;
}
