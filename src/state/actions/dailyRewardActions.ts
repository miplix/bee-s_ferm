import type { GameState } from "../../domain/types/game";
import { isoDayKey, previousDayKey, getRewardPool, pickRandomReward } from "../../data/dailyRewards.data";

/** Can the player claim today's bonus? */
export function canClaimDailyReward(state: GameState, now: number): boolean {
  return state.dailyReward.lastClaimDay !== isoDayKey(now);
}

/** Compute the streak the player would be on if they claim now. */
export function getCurrentStreakDay(state: GameState, now: number): number {
  const last = state.dailyReward.lastClaimDay;
  if (!last) return 1;
  const yesterday = previousDayKey(now);
  if (last === yesterday) return state.dailyReward.streak + 1;
  return 1; // missed → reset
}

/** Hash a string into a 32-bit seed (deterministic). */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** Preview today's reward (deterministic — same value all day). */
export function previewTodayReward(state: GameState, now: number) {
  const day = getCurrentStreakDay(state, now);
  const pool = getRewardPool(day);
  const seed = hashString(`${isoDayKey(now)}:${state.seed ?? "anon"}:${day}`);
  return pickRandomReward(pool, seed);
}

/** Compatibility shim. */
export function getCurrentRewardDay(state: GameState, now: number): number {
  return getCurrentStreakDay(state, now);
}

/** Claim — automatically picks the random option (script-driven). */
export function claimDailyReward(state: GameState, now: number): GameState {
  if (!canClaimDailyReward(state, now)) return state;

  const day = getCurrentStreakDay(state, now);
  const { option } = previewTodayReward(state, now);

  const inv = { ...state.inventory };
  let coins = state.coins;
  if (option.kind === "coins") {
    coins = parseFloat((coins + option.qty).toFixed(4));
  } else {
    inv[option.itemId] = (inv[option.itemId] ?? 0) + option.qty;
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
  const { option } = previewTodayReward(state, now);
  return {
    coins: option.kind === "coins" ? option.qty : 0,
    itemId: option.kind === "coins" ? null : option.itemId,
    itemQty: option.qty,
  };
}
