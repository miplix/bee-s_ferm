import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Singleton Supabase client. Returns null if env not configured (graceful local-only mode). */
let _client: SupabaseClient | null = null;
let _checked = false;

export function getSupabase(): SupabaseClient | null {
  if (_checked) return _client;
  _checked = true;
  if (!URL || !ANON) {
    console.warn("[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing — running local-only");
    return null;
  }
  _client = createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,        // for magic-link callback
      flowType: "pkce",
    },
  });
  return _client;
}

export function isCloudEnabled(): boolean {
  return !!URL && !!ANON;
}
