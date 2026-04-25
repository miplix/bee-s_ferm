import type { GameState } from "../../domain/types/game";
import { isoWeekKey, rollWeeklyBonus } from "../../data/dailyRewards.data";
import { getLevel } from "../../domain/level/level";

/** Can the player claim this week's bonus? */
export function canClaimDailyReward(state: GameState, now: number): boolean {
  return state.dailyReward.lastClaimDay !== isoWeekKey(now);
}

/** Reward day is unused under the weekly system — kept for popup compatibility. */
export function getCurrentRewardDay(_state: GameState, _now: number): number {
  return 1;
}

/** Get the weekly bonus the player would claim if they claimed now. */
export function previewWeeklyBonus(state: GameState, now: number) {
  const level = getLevel(state.xp);
  return rollWeeklyBonus(level, isoWeekKey(now));
}

/** Claim the weekly bonus. */
export function claimDailyReward(state: GameState, now: number): GameState {
  if (!canClaimDailyReward(state, now)) return state;

  const week = isoWeekKey(now);
  const level = getLevel(state.xp);
  const bonus = rollWeeklyBonus(level, week);

  const inv = { ...state.inventory };
  if (bonus.itemId) {
    inv[bonus.itemId] = (inv[bonus.itemId] ?? 0) + bonus.itemQty;
  }
  const newCoins = parseFloat((state.coins + bonus.coins).toFixed(4));

  return {
    ...state,
    inventory: inv,
    coins: newCoins,
    dailyReward: {
      lastClaimDay: week,
      streak: state.dailyReward.streak + 1,
    },
    lastMeaningfulActivity: now,
  };
}
