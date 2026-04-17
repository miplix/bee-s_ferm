import type { GameState, BeehiveState } from "../../domain/types/game";
import { maxBeehiveSlots } from "../../domain/beehives/slots";
import { getLevel } from "../../domain/level/level";
import { isReady } from "../../domain/time/time";
import {
  BEEHIVE_LV1_COST,
  DEMO_ACTION_INTERVAL_MS,
  DEMO_UPGRADE_ACTIONS,
  DEMO_INSTANT_UPGRADE_COST,
  DEMO_POLLEN_PER_DAY,
  LV1_POLLEN_PER_DAY,
} from "../../data/beehives.data";

/** Perform an action on the demo beehive (3x/day, 8h cooldown). */
export function beehiveAction(
  state: GameState,
  hiveId: string,
  now: number,
): GameState {
  const idx = state.beehives.findIndex((h) => h.id === hiveId);
  if (idx < 0) return state;

  const hive = state.beehives[idx];
  if (hive.level !== 0) return state; // only demo hives have click-actions

  // Check 8h cooldown
  if (!isReady(hive.lastAction, DEMO_ACTION_INTERVAL_MS, now)) return state;

  const newHive: BeehiveState = {
    ...hive,
    actions: hive.actions + 1,
    lastAction: now,
  };

  // Small pollen reward per action
  const pollenReward = DEMO_POLLEN_PER_DAY / 3; // ~0.13 per action

  const newBeehives = [...state.beehives];
  newBeehives[idx] = newHive;

  return {
    ...state,
    beehives: newBeehives,
    pollen: parseFloat((state.pollen + pollenReward).toFixed(4)),
    lastMeaningfulActivity: now,
  };
}

/** Buy a demo beehive (free, placed after Spring Island transition). */
export function addDemoBeehive(
  state: GameState,
  now: number,
): GameState {
  if (state.island === "basic") return state; // must be on Spring+

  const level = getLevel(state.xp);
  const maxSlots = maxBeehiveSlots(level, state.island);
  if (state.beehives.length >= maxSlots) return state;

  const hive: BeehiveState = {
    id: crypto.randomUUID(),
    level: 0,
    actions: 0,
    lastAction: 0,
    createdAt: now,
    accruedPollen: 0,
    lastAccrualAt: now,
  };

  return {
    ...state,
    beehives: [...state.beehives, hive],
    lastMeaningfulActivity: now,
  };
}

/** Buy a paid Lv1 beehive (costs 1000 pollen). */
export function buyBeehive(
  state: GameState,
  now: number,
): GameState {
  if (state.island === "basic") return state;

  const level = getLevel(state.xp);
  const maxSlots = maxBeehiveSlots(level, state.island);
  if (state.beehives.length >= maxSlots) return state;

  if (state.pollen < BEEHIVE_LV1_COST) return state;

  const hive: BeehiveState = {
    id: crypto.randomUUID(),
    level: 1,
    actions: 0,
    lastAction: 0,
    createdAt: now,
    accruedPollen: 0,
    lastAccrualAt: now,
  };

  return {
    ...state,
    pollen: parseFloat((state.pollen - BEEHIVE_LV1_COST).toFixed(4)),
    beehives: [...state.beehives, hive],
    lastMeaningfulActivity: now,
  };
}

/** Upgrade demo beehive to Lv1 (1000 actions completed OR pay 1000 pollen). */
export function upgradeDemoHive(
  state: GameState,
  hiveId: string,
  useInstant: boolean,
  now: number,
): GameState {
  const idx = state.beehives.findIndex((h) => h.id === hiveId);
  if (idx < 0) return state;

  const hive = state.beehives[idx];
  if (hive.level !== 0) return state;

  if (useInstant) {
    // Pay pollen for remaining actions
    const remaining = Math.max(0, DEMO_UPGRADE_ACTIONS - hive.actions);
    const cost = remaining; // 1 pollen per missing action
    if (state.pollen < cost) return state;

    const newBeehives = [...state.beehives];
    newBeehives[idx] = { ...hive, level: 1, actions: DEMO_UPGRADE_ACTIONS };

    return {
      ...state,
      pollen: parseFloat((state.pollen - cost).toFixed(4)),
      beehives: newBeehives,
      lastMeaningfulActivity: now,
    };
  }

  // Natural upgrade: must have 1000 actions
  if (hive.actions < DEMO_UPGRADE_ACTIONS) return state;

  const newBeehives = [...state.beehives];
  newBeehives[idx] = { ...hive, level: 1 };

  return { ...state, beehives: newBeehives, lastMeaningfulActivity: now };
}

/** Accrue passive pollen for all hives (called by tickPassive). */
export function accruePassivePollen(
  state: GameState,
  now: number,
): GameState {
  let totalAccrued = 0;
  const newBeehives = state.beehives.map((hive) => {
    const rate = hive.level === 0 ? DEMO_POLLEN_PER_DAY : LV1_POLLEN_PER_DAY * hive.level;
    const elapsedMs = now - hive.lastAccrualAt;
    if (elapsedMs <= 0) return hive;

    const elapsedDays = elapsedMs / 86_400_000;
    const accrued = rate * elapsedDays;
    totalAccrued += accrued;

    return { ...hive, accruedPollen: hive.accruedPollen + accrued, lastAccrualAt: now };
  });

  if (totalAccrued <= 0) return state;

  return {
    ...state,
    beehives: newBeehives,
    pollen: parseFloat((state.pollen + totalAccrued).toFixed(4)),
  };
}
