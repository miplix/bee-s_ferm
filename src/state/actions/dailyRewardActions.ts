import type { GameState } from "../../domain/types/game";
import { DAILY_REWARDS, MAX_STREAK } from "../../data/dailyRewards.data";

// --- Helpers ---

function todayISO(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function yesterdayISO(now: number): string {
  return new Date(now - 86_400_000).toISOString().slice(0, 10);
}

// --- Actions ---

/**
 * Check if the daily reward can be claimed today.
 */
export function canClaimDailyReward(state: GameState, now: number): boolean {
  const today = todayISO(now);
  return state.dailyReward.lastClaimDay !== today;
}

/**
 * Get the current streak day (1-7) the player would claim.
 */
export function getCurrentRewardDay(state: GameState, now: number): number {
  const yesterday = yesterdayISO(now);
  const lastClaim = state.dailyReward.lastClaimDay;

  // Streak continues if last claim was yesterday
  if (lastClaim === yesterday) {
    const nextDay = (state.dailyReward.streak % MAX_STREAK) + 1;
    return nextDay;
  }

  // Streak broken (or first time) — start at day 1
  return 1;
}

/**
 * Claim the daily reward.
 */
export function claimDailyReward(
  state: GameState,
  now: number,
): GameState {
  if (!canClaimDailyReward(state, now)) return state;

  const rewardDay = getCurrentRewardDay(state, now);
  const rewardDef = DAILY_REWARDS.find((r) => r.day === rewardDay);
  if (!rewardDef) return state;

  const inv = { ...state.inventory };

  // Grant items
  for (const item of rewardDef.items) {
    inv[item.itemId] = (inv[item.itemId] ?? 0) + item.qty;
  }

  // Grant coins
  const newCoins = parseFloat((state.coins + rewardDef.coins).toFixed(4));

  return {
    ...state,
    inventory: inv,
    coins: newCoins,
    dailyReward: {
      lastClaimDay: todayISO(now),
      streak: rewardDay,
    },
    lastMeaningfulActivity: now,
  };
}
