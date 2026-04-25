const isDev = import.meta.env.DEV;

// Sentry is loaded lazily so this module doesn't hard-depend on the SDK
function sentryCaptureException(err: unknown, ctx?: object) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Sentry = (globalThis as any).__Sentry;
  Sentry?.captureException(err, ctx ? { extra: ctx } : undefined);
}

function sentryBreadcrumb(level: "warning" | "info", message: string, data?: object) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Sentry = (globalThis as any).__Sentry;
  Sentry?.addBreadcrumb({ level, message, data });
}

export const log = {
  debug: (...args: unknown[]) => {
    if (isDev) console.debug("[debug]", ...args);
  },

  info: (msg: string, data?: object) => {
    console.info("[info]", msg, data ?? "");
    sentryBreadcrumb("info", msg, data);
  },

  warn: (msg: string, data?: object) => {
    console.warn("[warn]", msg, data ?? "");
    sentryBreadcrumb("warning", msg, data);
  },

  error: (err: unknown, ctx?: object) => {
    console.error("[error]", err, ctx ?? "");
    sentryCaptureException(err, ctx);
  },
};
