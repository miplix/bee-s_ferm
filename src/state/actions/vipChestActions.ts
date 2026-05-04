import type { GameState } from "../../domain/types/game";
import { isoDayKey, previousDayKey } from "../../data/dailyRewards.data";
import { pickVipReward } from "../../data/vipRewards.data";

export function isVipActiveNow(state: GameState, now: number): boolean {
  return !!(state.vipExpiresAt && state.vipExpiresAt > now);
}

export function canClaimVipChest(state: GameState, now: number): boolean {
  if (!isVipActiveNow(state, now)) return false;
  return state.vipChest?.lastClaimDay !== isoDayKey(now);
}

export function getVipChestStreakDay(state: GameState, now: number): number {
  const last = state.vipChest?.lastClaimDay;
  if (!last) return 1;
  const yesterday = previousDayKey(now);
  if (last === yesterday) return (state.vipChest?.streak ?? 0) + 1;
  return 1;
}

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function previewVipChest(state: GameState, now: number) {
  const day = getVipChestStreakDay(state, now);
  const seed = hashString(`vip:${isoDayKey(now)}:${state.seed ?? "anon"}:${day}`);
  return pickVipReward(seed);
}

export function claimVipChest(state: GameState, now: number): GameState {
  if (!canClaimVipChest(state, now)) return state;

  const { option, qty } = previewVipChest(state, now);
  const day = getVipChestStreakDay(state, now);

  let coins = state.coins;
  let pollen = state.pollen ?? 0;
  const inv = { ...state.inventory };

  if (option.itemId === "coins") {
    coins = parseFloat((coins + qty).toFixed(4));
  } else if (option.itemId === "pollen") {
    pollen = parseFloat((pollen + qty).toFixed(4));
  } else {
    inv[option.itemId] = (inv[option.itemId] ?? 0) + qty;
  }

  return {
    ...state,
    coins,
    pollen,
    inventory: inv,
    vipChest: { lastClaimDay: isoDayKey(now), streak: day },
    lastMeaningfulActivity: now,
  };
}
