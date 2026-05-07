/**
 * Cloud sync через NEAR account_id (без отдельного email-логина).
 *
 * Поток:
 * 1. Пользователь подключает NEAR-кошелёк → знаем `account.id`.
 * 2. ensureAnonAuth() — если нет Supabase-сессии, делаем signInAnonymously().
 *    Анонимная сессия нужна только чтобы пройти RLS на RPC `upsert_near_save`.
 * 3. push/pull save через RPC, ключ — NEAR account_id.
 *    На разных устройствах с тем же кошельком — один сейв (cross-device).
 *
 * Если кошелёк не подключён или Supabase не настроен → молча пропускаем
 * (только localStorage-режим).
 */

import { getSupabase } from "./client";
import { CURRENT_VERSION } from "../storage/schemaVersion";
import type { GameState } from "../../domain/types/game";
import { getAccount } from "../near/wallet";

const DEVICE_KEY = "near_farm_device_id";

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/**
 * Гарантирует наличие Supabase-сессии. Если нет — анонимный signin.
 * Возвращает true если сессия есть/создана успешно.
 */
async function ensureAnonAuth(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) return true;
    const { error } = await sb.auth.signInAnonymously();
    if (error) {
      console.warn("[sync] anonymous signin failed (anon auth disabled?):", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[sync] ensureAnonAuth threw:", e);
    return false;
  }
}

/** Push текущего state в облако по NEAR account_id. No-op если кошелёк не подключён. */
export async function pushSave(state: GameState): Promise<void> {
  const acc = getAccount();
  if (!acc) return; // нет кошелька — нечего синкать
  const sb = getSupabase();
  if (!sb) return;
  const ok = await ensureAnonAuth();
  if (!ok) return;

  const { error } = await sb.rpc("upsert_near_save", {
    p_near_account_id: acc.id,
    p_state: state as any,
    p_schema_version: CURRENT_VERSION,
    p_device_id: getDeviceId(),
  });
  if (error) console.warn("[sync] push failed:", error.message);
}

/**
 * Pull сейва из облака по NEAR account_id.
 * Возвращает null если нет кошелька, нет облака, или сейв отсутствует.
 */
export async function pullSave(): Promise<{ state: GameState; updatedAt: string; deviceId: string | null } | null> {
  const acc = getAccount();
  if (!acc) return null;
  const sb = getSupabase();
  if (!sb) return null;
  const ok = await ensureAnonAuth();
  if (!ok) return null;

  const { data, error } = await sb.rpc("get_near_save", { p_near_account_id: acc.id });
  if (error) {
    console.warn("[sync] pull failed:", error.message);
    return null;
  }
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    state: row.state as GameState,
    updatedAt: row.updated_at,
    deviceId: row.device_id ?? null,
  };
}

/** Debounced push helper — вызывается при каждом изменении store. */
let pushTimer: ReturnType<typeof setTimeout> | null = null;
export function schedulePush(state: GameState, delayMs = 5_000): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushSave(state).catch((e) => console.warn("[sync] push failed:", e));
  }, delayMs);
}
