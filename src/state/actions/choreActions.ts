import type { GameState, ChoreProgress } from "../../domain/types/game";
import { mulberry32 } from "../../domain/rng/prng";
import { buildSeed, dayBucket } from "../../domain/rng/seed";
import { CHORES, DAILY_CHORE_COUNT, type ChoreDef } from "../../data/chores.data";

// --- Helpers ---

function todayISO(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Generate today's chores using seeded PRNG. */
function generateDailyChores(userSeed: string, now: number): ChoreProgress[] {
  const day = dayBucket(now);
  const seed = buildSeed(userSeed, day, "chores");
  const rng = mulberry32(seed);

  // Shuffle and pick DAILY_CHORE_COUNT
  const pool = [...CHORES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, DAILY_CHORE_COUNT).map((def) => ({
    choreId: def.id,
    description: def.description,
    requirement: { ...def.requirement },
    reward: { ...def.reward },
    progress: 0,
    claimed: false,
  }));
}

// --- Actions ---

/**
 * Reset chores if a new day has started. Called on game load / tick.
 */
export function refreshChores(
  state: GameState,
  now: number,
): GameState {
  const today = todayISO(now);
  if (state.chores.lastResetDay === today && state.chores.active.length > 0) {
    return state;
  }

  const active = generateDailyChores(state.seed, now);
  return {
    ...state,
    chores: {
      active,
      lastResetDay: today,
    },
  };
}

/**
 * Increment chore progress for a given action type.
 * Called from other actions (harvest, cook, sell, gather).
 */
export function incrementChoreProgress(
  state: GameState,
  actionType: "harvest" | "cook" | "sell" | "gather",
  target: string | undefined,
  amount: number,
): GameState {
  const today = todayISO(Date.now());
  if (state.chores.lastResetDay !== today) return state;

  let changed = false;
  const newActive = state.chores.active.map((chore) => {
    if (chore.claimed) return chore;
    if (chore.requirement.type !== actionType) return chore;
    // If chore has a specific target, check it matches
    if (chore.requirement.target && chore.requirement.target !== target) return chore;
    // Already maxed
    if (chore.progress >= chore.requirement.qty) return chore;

    changed = true;
    return {
      ...chore,
      progress: Math.min(chore.progress + amount, chore.requirement.qty),
    };
  });

  if (!changed) return state;

  return {
    ...state,
    chores: {
      ...state.chores,
      active: newActive,
    },
  };
}

/**
 * Claim a completed chore's reward.
 */
export function claimChore(
  state: GameState,
  choreId: string,
  now: number,
): GameState {
  const chore = state.chores.active.find((c) => c.choreId === choreId);
  if (!chore) return state;
  if (chore.claimed) return state;
  if (chore.progress < chore.requirement.qty) return state;

  const newActive = state.chores.active.map((c) =>
    c.choreId === choreId ? { ...c, claimed: true } : c,
  );

  return {
    ...state,
    coins: parseFloat((state.coins + chore.reward.coins).toFixed(4)),
    xp: state.xp + chore.reward.xp,
    chores: {
      ...state.chores,
      active: newActive,
    },
    lastMeaningfulActivity: now,
  };
}
