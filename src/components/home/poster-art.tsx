/**
 * Compact poster illustrations for phrase-panel thumbnails (cards without
 * a designed image asset). Flat pastel fills + ink outline, matching the
 * tool-page hero illustrations.
 */
export type PosterArtKind =
  | "nameGenerator"
  | "dday"
  | "hospitalBag"
  | "balanceGame"
  | "parentMbti"
  | "milestones";

interface PosterArtProps {
  kind: PosterArtKind;
  className?: string;
}

const INK = "#2B2B2B";

export function PosterArt({ kind, className }: PosterArtProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden className={className}>
      {ART[kind]}
    </svg>
  );
}

const ART: Record<PosterArtKind, React.ReactNode> = {
  /* capsule-toy machine */
  nameGenerator: (
    <>
      <path d="M26 46 a22 22 0 0 1 44 0 z" fill="#F5F7F9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="39" cy="38" r="5.5" fill="#FFD1DC" stroke={INK} strokeWidth="2.2" />
      <circle cx="52" cy="33" r="5.5" fill="#A6C6E0" stroke={INK} strokeWidth="2.2" />
      <circle cx="58" cy="40" r="4.5" fill="#F2D06B" stroke={INK} strokeWidth="2.2" />
      <rect x="30" y="46" width="36" height="26" rx="5" fill="#8AB09D" stroke={INK} strokeWidth="3" />
      <rect x="42" y="56" width="12" height="8" rx="2" fill="#F5F7F9" stroke={INK} strokeWidth="2.2" />
      <circle cx="48" cy="84" r="6.5" fill="#FFD1DC" stroke={INK} strokeWidth="2.4" />
      <path d="M41.5 84 h13" stroke={INK} strokeWidth="2.2" />
    </>
  ),

  /* calendar with heart day */
  dday: (
    <>
      <rect x="18" y="26" width="60" height="52" rx="7" fill="#F5F7F9" stroke={INK} strokeWidth="3" />
      <path d="M18 40 h60" stroke={INK} strokeWidth="3" />
      <path d="M32 18 v12 M64 18 v12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="52" r="2.6" fill="#C9C7C2" />
      <circle cx="48" cy="52" r="2.6" fill="#C9C7C2" />
      <circle cx="64" cy="52" r="2.6" fill="#C9C7C2" />
      <path
        d="M48 72s-9-5.5-9-11.6a5.4 5.4 0 0 1 9-3.6 5.4 5.4 0 0 1 9 3.6C57 66.5 48 72 48 72z"
        fill="#FFD1DC"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </>
  ),

  /* packed hospital bag */
  hospitalBag: (
    <>
      <path d="M36 38 v-6 a12 12 0 0 1 24 0 v6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="22" y="38" width="52" height="38" rx="9" fill="#F5F7F9" stroke={INK} strokeWidth="3" />
      <path d="M22 54 h52" stroke={INK} strokeWidth="3" />
      <circle cx="64" cy="64" r="9.5" fill="#8AB09D" stroke={INK} strokeWidth="2.6" />
      <path d="M59.5 64 l3 3 6-6" stroke="#FFFFFF" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M35 62s-5-3-5-6.4a3 3 0 0 1 5-2 3 3 0 0 1 5 2C40 59 35 62 35 62z"
        fill="#FFD1DC"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </>
  ),

  /* seesaw with riders */
  balanceGame: (
    <>
      <path d="M18 62 L78 48" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 56 l-8 20 h16 z" fill="#F5F7F9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="54" r="8.5" fill="#A6C6E0" stroke={INK} strokeWidth="2.6" />
      <circle cx="72" cy="40" r="8.5" fill="#FFD1DC" stroke={INK} strokeWidth="2.6" />
      <circle cx="21.5" cy="52.5" r="1.2" fill={INK} />
      <circle cx="26.5" cy="52.5" r="1.2" fill={INK} />
      <path d="M22 56 q2 1.8 4 0" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="69.5" cy="38.5" r="1.2" fill={INK} />
      <circle cx="74.5" cy="38.5" r="1.2" fill={INK} />
      <path d="M70 42 q2 1.8 4 0" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),

  /* four MBTI axis dots */
  parentMbti: (
    <>
      <circle cx="34" cy="34" r="13" fill="#FFD1DC" stroke={INK} strokeWidth="3" />
      <circle cx="62" cy="34" r="13" fill="#A6C6E0" stroke={INK} strokeWidth="3" />
      <circle cx="34" cy="62" r="13" fill="#F2D06B" stroke={INK} strokeWidth="3" />
      <circle cx="62" cy="62" r="13" fill="#8AB09D" stroke={INK} strokeWidth="3" />
      <path d="M30 33 q4 3.4 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 33 q4 3.4 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 61 q4 3.4 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 61 q4 3.4 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),

  /* belly with tiny heart */
  milestones: (
    <>
      <path
        d="M42 16 C 36 32, 28 42, 28 58 C 28 72, 39 82, 54 82 C 69 82, 78 71, 78 57 C 78 45, 72 34, 64 22"
        fill="#F5F7F9"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="54" cy="58" r="7" fill="#FFD1DC" stroke={INK} strokeWidth="2.2" />
      <path
        d="M54 44s-5.5-3.3-5.5-6.8a3.2 3.2 0 0 1 5.5-2.1 3.2 3.2 0 0 1 5.5 2.1C59.5 40.7 54 44 54 44z"
        fill="#E87A91"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </>
  ),
};
