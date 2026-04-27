import type { GameState } from "../../domain/types/game";
import { isoDayKey, previousDayKey, getDailyChoices } from "../../data/dailyRewards.data";

/** Can the player claim today's bonus? */
export function canClaimDailyReward(state: GameState, now: number): boolean {
  return state.dailyReward.lastClaimDay !== isoDayKey(now);
}

/** Compute the streak the player would be on if they claim now (resets if a day was missed). */
export function getCurrentStreakDay(state: GameState, now: number): number {
  const last = state.dailyReward.lastClaimDay;
  if (!last) return 1; // first ever claim
  const yesterday = previousDayKey(now);
  if (last === yesterday) {
    return state.dailyReward.streak + 1; // streak continues
  }
  return 1; // missed a day — start over
}

/** Compatibility shim for old DailyRewardPopup. */
export function getCurrentRewardDay(state: GameState, now: number): number {
  return getCurrentStreakDay(state, now);
}

/** Get menu of choices for current streak. */
export function getDailyMenu(state: GameState, now: number) {
  const day = getCurrentStreakDay(state, now);
  return getDailyChoices(day);
}

/**
 * Claim the daily reward: player picks one option (by index).
 * Without index, picks coins (option 0) for backwards compatibility.
 */
export function claimDailyReward(state: GameState, now: number, optionIndex = 0): GameState {
  if (!canClaimDailyReward(state, now)) return state;

  const day = getCurrentStreakDay(state, now);
  const opts = getDailyChoices(day);
  const choice = opts[Math.max(0, Math.min(optionIndex, opts.length - 1))];

  const inv = { ...state.inventory };
  let coins = state.coins;
  if (choice.kind === "coins") {
    coins = parseFloat((coins + choice.qty).toFixed(4));
  } else {
    inv[choice.itemId] = (inv[choice.itemId] ?? 0) + choice.qty;
  }

  return {
    ...state,
    coins,
    inventory: inv,
    dailyReward: {
      lastClaimDay: isoDayKey(now),
      streak: day,
    },
    lastMeaningfulActivity: now,
  };
}

/** Compat preview for old code paths. */
export function previewWeeklyBonus(state: GameState, now: number) {
  const opts = getDailyMenu(state, now);
  const first = opts[0];
  return { coins: first.kind === "coins" ? first.qty : 0, itemId: first.kind === "coins" ? null : first.itemId, itemQty: first.qty };
}
