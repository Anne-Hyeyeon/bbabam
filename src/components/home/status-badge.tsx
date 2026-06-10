export function StatusBadge({ status, label }: { status: "live" | "new"; label: string }) {
  return (
    <span
      className={[
        "absolute top-2 left-2 rounded-full px-2 py-[2px] text-[10px] font-semibold tracking-wide shadow-card",
        status === "live" ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-primary)] text-white",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
