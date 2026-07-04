import Image from "next/image";

/**
 * Poster art for phrase-panel thumbnails (cards without a designed image
 * asset). Uses Microsoft Fluent Emoji 3D renders (MIT) stored under
 * /public/art — see public/art/LICENSE.md.
 */
export type PosterArtKind =
  | "nameGenerator"
  | "dday"
  | "hospitalBag"
  | "balanceGame"
  | "parentMbti"
  | "milestones"
  | "announceCard"
  | "genderQuiz"
  | "geneticsPredict"
  | "folkloreQuiz";

const ART_SRC: Record<PosterArtKind, string> = {
  nameGenerator: "/art/name-generator.png",
  dday: "/art/dday.png",
  hospitalBag: "/art/hospital-bag.png",
  balanceGame: "/art/balance-game.png",
  parentMbti: "/art/parent-mbti.png",
  milestones: "/art/milestones.png",
  announceCard: "/art/announce-card.png",
  genderQuiz: "/art/gender-quiz.png",
  geneticsPredict: "/art/genetics.png",
  folkloreQuiz: "/art/folklore.png",
};

/** Source assets are 256×256 with transparency. */
const ART_NATIVE_SIZE = 256;

interface PosterArtProps {
  kind: PosterArtKind;
  className?: string;
}

export function PosterArt({ kind, className }: PosterArtProps) {
  return (
    <Image
      src={ART_SRC[kind]}
      alt=""
      aria-hidden
      width={ART_NATIVE_SIZE}
      height={ART_NATIVE_SIZE}
      className={["drop-shadow-sm", className ?? ""].join(" ")}
    />
  );
}
