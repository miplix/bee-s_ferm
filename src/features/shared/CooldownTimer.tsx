import { remaining, fmtDuration } from "../../domain/time/time";
import { useTick } from "../../hooks/useTick";

interface Props {
  lastAt: number;
  cooldownMs: number;
  className?: string;
}

export function CooldownTimer({ lastAt, cooldownMs, className = "" }: Props) {
  useTick(1000);
  const ms = remaining(lastAt, cooldownMs, Date.now());
  if (ms <= 0) return null;
  return (
    <span className={`font-game text-[7px] text-yellow-300 ${className}`}>
      {fmtDuration(ms)}
    </span>
  );
}
