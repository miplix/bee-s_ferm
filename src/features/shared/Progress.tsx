interface Props {
  value: number;  // 0..1
  className?: string;
  color?: string;
}

export function Progress({ value, className = "", color = "bg-green-500" }: Props) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className={`w-full h-2 bg-black/40 border border-black/60 ${className}`}>
      <div
        className={`h-full ${color} transition-[width] duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
