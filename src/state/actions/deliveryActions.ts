import type { GameState, ActiveDelivery } from "../../domain/types/game";
import { getLevel } from "../../domain/level/level";
import { mulberry32, pick, randInt } from "../../domain/rng/prng";
import { buildSeed, dayBucket } from "../../domain/rng/seed";
import {
  DELIVERIES, deliverySlotCount, DELIVERY_REFRESH_MS,
  type DeliveryDef,
} from "../../data/deliveries.data";

// --- Helpers ---

function todayISO(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Build a pool of eligible delivery defs for the player's level. */
function eligibleDefs(level: number): DeliveryDef[] {
  return DELIVERIES.filter((d) => d.minLevel <= level);
}

/**
 * Generate a set of deliveries for the day using seeded PRNG.
 * Returns `count` unique deliveries from the eligible pool.
 */
function generateDailyDeliveries(
  userSeed: string,
  now: number,
  level: number,
  count: number,
): ActiveDelivery[] {
  const pool = eligibleDefs(level);
  if (pool.length === 0) return [];

  const day = dayBucket(now);
  const seed = buildSeed(userSeed, day, "deliveries");
  const rng = mulberry32(seed);

  // Shuffle-pick `count` unique defs
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  const expiresAt = now + DELIVERY_REFRESH_MS;

  return selected.map((def, idx) => ({
    id: `${def.id}_${day}_${idx}`,
    defId: def.id,
    npcName: def.npcName,
    npcEmoji: def.npcEmoji,
    request: def.request.map((r) => ({ ...r })),
    reward: { ...def.reward },
    expiresAt,
  }));
}

// --- Actions ---

/**
 * Refresh deliveries if needed (new day or expired slots).
 * Called on game load and periodically.
 */
export function refreshDeliveries(
  state: GameState,
  now: number,
): GameState {
  const level = getLevel(state.xp);
  const slotCount = deliverySlotCount(level);
  const today = todayISO(now);
  const lastDay = todayISO(state.deliveries.lastRefresh || 0);

  // Full refresh if new day or no deliveries yet
  const needsFullRefresh =
    state.deliveries.active.length === 0 ||
    today !== lastDay;

  if (needsFullRefresh) {
    const active = generateDailyDeliveries(state.seed, now, level, slotCount);
    return {
      ...state,
      deliveries: {
        ...state.deliveries,
        active,
        lastRefresh: now,
      },
    };
  }

  // Replace expired individual slots
  const hasExpired = state.deliveries.active.some((d) => d.expiresAt <= now);
  if (!hasExpired) return state;

  const day = dayBucket(now);
  const pool = eligibleDefs(level);
  const rng = mulberry32(buildSeed(state.seed, day, `delivery-refill:${now}`));

  const activeIds = new Set(state.deliveries.active.filter((d) => d.expiresAt > now).map((d) => d.defId));
  const available = pool.filter((d) => !activeIds.has(d.id));

  const newActive = state.deliveries.active.map((delivery) => {
    if (delivery.expiresAt > now) return delivery;
    // Replace expired slot
    if (available.length === 0) return delivery;
    const def = pick(rng, available);
    // Remove from available to avoid duplicates
    const idx = available.indexOf(def);
    if (idx >= 0) available.splice(idx, 1);

    return {
      id: `${def.id}_${day}_${Math.floor(rng() * 10000)}`,
      defId: def.id,
      npcName: def.npcName,
      npcEmoji: def.npcEmoji,
      request: def.request.map((r) => ({ ...r })),
      reward: { ...def.reward },
      expiresAt: now + DELIVERY_REFRESH_MS,
    };
  });

  return {
    ...state,
    deliveries: {
      ...state.deliveries,
      active: newActive,
      lastRefresh: now,
    },
  };
}

/**
 * Complete a delivery: check items, consume them, grant rewards.
 */
export function completeDelivery(
  state: GameState,
  deliveryId: string,
  now: number,
): GameState {
  const delivery = state.deliveries.active.find((d) => d.id === deliveryId);
  if (!delivery) return state;

  // Check all requested items are in inventory
  for (const req of delivery.request) {
    const have = state.inventory[req.itemId] ?? 0;
    if (have < req.qty) return state; // not enough
  }

  // Consume items
  const inv = { ...state.inventory };
  for (const req of delivery.request) {
    inv[req.itemId] = (inv[req.itemId] ?? 0) - req.qty;
    if (inv[req.itemId]! <= 0) delete inv[req.itemId];
  }

  // Grant rewards
  const newCoins = parseFloat((state.coins + delivery.reward.coins).toFixed(4));
  const newXp = state.xp + delivery.reward.xp;

  // Add tickets to inventory
  if (delivery.reward.tickets > 0) {
    inv["ticket"] = (inv["ticket"] ?? 0) + delivery.reward.tickets;
  }

  // Remove completed delivery from active list
  const newActive = state.deliveries.active.filter((d) => d.id !== deliveryId);

  return {
    ...state,
    inventory: inv,
    coins: newCoins,
    xp: newXp,
    deliveries: {
      ...state.deliveries,
      active: newActive,
      completed: state.deliveries.completed + 1,
    },
    lastMeaningfulActivity: now,
  };
}
