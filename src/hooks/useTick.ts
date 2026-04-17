import { useState, useEffect } from "react";

/**
 * Forces a re-render every `intervalMs` milliseconds.
 * Used for live countdown timers in the UI.
 * Does NOT mutate game state.
 */
export function useTick(intervalMs = 1000): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}
