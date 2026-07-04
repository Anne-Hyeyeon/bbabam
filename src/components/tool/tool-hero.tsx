import { Badge } from "@/components/ui/badge";

interface ToolHeroProps {
  /** Decorative SVG illustration, sized by the caller. */
  illustration: React.ReactNode;
  title: string;
  /** Subtitle lines, rendered with line breaks between them. */
  lines: string[];
  /** Optional pill badges under the subtitle (e.g. "12문항", "약 3분"). */
  badges?: string[];
}

/** Centered intro hero shared by every tool page. */
export function ToolHero({ illustration, title, lines, badges }: ToolHeroProps) {
  return (
    <div className="text-center">
      {illustration}
      <h1 className="mt-2 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
        {title}
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
        {lines.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
      {badges && badges.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {badges.map((b) => (
            <Badge key={b} variant="secondary">
              {b}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
