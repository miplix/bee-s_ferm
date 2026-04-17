/** Milliseconds elapsed since `from`. */
export function elapsed(from: number, now: number): number {
  return Math.max(0, now - from);
}

/** True if enough time has passed since `lastAt`. */
export function isReady(lastAt: number, cooldownMs: number, now: number): boolean {
  if (lastAt === 0) return true;
  return now >= lastAt + cooldownMs;
}

/** Milliseconds remaining until ready. Returns 0 if already ready. */
export function remaining(lastAt: number, cooldownMs: number, now: number): number {
  if (lastAt === 0) return 0;
  return Math.max(0, lastAt + cooldownMs - now);
}

/** Human-friendly duration string: "2h 15m", "45s", "Ready". */
export function fmtDuration(ms: number): string {
  if (ms <= 0) return "Ready";
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/** Progress ratio 0..1 for a timed activity. */
export function progress(startedAt: number, durationMs: number, now: number): number {
  if (durationMs <= 0) return 1;
  return Math.min(1, elapsed(startedAt, now) / durationMs);
}
