export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SENTRY_DSN: string;
  PLAUSIBLE_DOMAIN: string;
  NEAR_NETWORK: "mainnet" | "testnet";
}

function getEnv(): Env {
  const raw = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN ?? "",
    PLAUSIBLE_DOMAIN: import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? "",
    NEAR_NETWORK: (import.meta.env.VITE_NEAR_NETWORK ?? "mainnet") as "mainnet" | "testnet",
  };

  // В dev падаем если нет критических переменных
  if (import.meta.env.DEV) {
    const missing = (["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const).filter((k) => !raw[k]);
    if (missing.length > 0) {
      console.warn(
        `[env] Missing env vars: ${missing.join(", ")}. Copy .env.local.example → .env.local`
      );
    }
  }

  return raw;
}

export const env: Env = getEnv();
