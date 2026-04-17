import { useEffect } from "react";
import { useStore } from "../state/store";

/**
 * Runs tickPassive on a 30-second interval for passive pollen accrual.
 */
export function usePassiveTick() {
  const tickPassive = useStore((s) => s.tickPassive);

  useEffect(() => {
    // Run once immediately on mount (offline catch-up)
    tickPassive();

    const id = setInterval(tickPassive, 30_000);
    return () => clearInterval(id);
  }, [tickPassive]);
}
