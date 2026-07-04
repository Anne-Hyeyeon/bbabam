interface DistroRowProps {
  label: string;
  count: number;
  total: number;
  /** CSS color for the filled bar. */
  color: string;
  muted?: boolean;
}

/** Labeled count + percentage bar for answer-distribution summaries. */
export function DistroRow({
  label,
  count,
  total,
  color,
  muted = false,
}: DistroRowProps) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px]">
        <span
          className={
            muted ? "text-[var(--color-ink-muted)]" : "text-[var(--color-ink)]"
          }
        >
          {label}
        </span>
        <span className="font-semibold text-[var(--color-ink)]">
          {count}개 · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
