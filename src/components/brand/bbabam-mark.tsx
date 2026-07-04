interface BbabamMarkProps {
  /** Rendered square size in px. */
  size?: number;
  className?: string;
}

/**
 * Brand mark: a happy cracking egg on a sage tile.
 * The crack + spark is the "빠밤!" surprise moment in one glyph.
 */
export function BbabamMark({ size = 24, className }: BbabamMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="46" height="46" rx="13" fill="var(--color-primary)" />
      {/* egg */}
      <path
        d="M24 8.5c7 0 12.5 8 12.5 16.5a12.5 12.5 0 1 1-25 0C11.5 16.5 17 8.5 24 8.5z"
        fill="#FFFFFF"
      />
      {/* zigzag crack */}
      <path
        d="M12.5 27.5 l5 2.6 4.2-3.4 4.4 3.4 4.2-3.4 4.7 3"
        stroke="#2B2B2B"
        strokeWidth="2.2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* happy face */}
      <circle cx="19" cy="20" r="1.8" fill="#2B2B2B" />
      <circle cx="29" cy="20" r="1.8" fill="#2B2B2B" />
      <path
        d="M21.5 23.5 q2.5 2.6 5 0"
        stroke="#2B2B2B"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* cheeks */}
      <circle cx="15.5" cy="23" r="1.8" fill="#FFB7C6" opacity="0.9" />
      <circle cx="32.5" cy="23" r="1.8" fill="#FFB7C6" opacity="0.9" />
      {/* spark */}
      <path d="M38 7 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 z" fill="#F2D06B" />
    </svg>
  );
}
