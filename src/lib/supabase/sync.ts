import { getSupabase } from "./client";
import { CURRENT_VERSION } from "../storage/schemaVersion";
import type { GameState } from "../../domain/types/game";

const DEVICE_KEY = "near_farm_device_id";

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Push current state to Supabase. Silent no-op if no auth or no cloud. */
export async function pushSave(state: GameState): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  await sb.from("saves").upsert({
    user_id: user.id,
    state: state as any,
    schema_version: CURRENT_VERSION,
    device_id: getDeviceId(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
}

/** Pull save from cloud. Returns null if no auth, no cloud, or no save. */
export async function pullSave(): Promise<{ state: GameState; updatedAt: string; deviceId: string | null } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await sb
    .from("saves")
    .select("state, schema_version, updated_at, device_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { state: data.state as GameState, updatedAt: data.updated_at, deviceId: data.device_id };
}

/** Debounced push helper. */
let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush(state: GameState, delayMs = 5_000): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushSave(state).catch((e) => console.warn("[supabase] push failed:", e));
  }, delayMs);
}
