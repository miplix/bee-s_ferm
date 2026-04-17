import type { GameState } from "../../domain/types/game";
import { getLevel } from "../../domain/level/level";
import { canLearnSkill } from "../../domain/skills/skillEngine";
import { getSkillDef } from "../../data/skills.data";

/** Learn a skill, spending the required points. */
export function learnSkill(state: GameState, skillId: string): GameState {
  const level = getLevel(state.xp);

  if (!canLearnSkill(skillId, state.skills, level)) return state;

  const def = getSkillDef(skillId);
  if (!def) return state;

  return {
    ...state,
    skills: { ...state.skills, [skillId]: true },
    skillPoints: state.skillPoints + def.pointCost, // track total spent for persistence
  };
}
