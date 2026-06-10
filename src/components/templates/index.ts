import type { ComponentType } from "react";

export interface TemplateInteractionProps {
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  ultrasoundImageUrl?: string;
  onReveal: () => void;
}

export interface CardTemplate {
  id: string;
  nameKey: string; // i18n key under "templates"
  interactionType: string;
  thumbnail: string; // emoji placeholder
  /** Baked picker thumbnail (typography included); hides the text overlay when set. */
  imageSrc?: string;
  component: () => Promise<{ default: ComponentType<TemplateInteractionProps> }>;
}

export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    thumbnail: "🎫",
    imageSrc: "/thumbnails/shared/gender-reveal-lottery.png",
    component: () => import("./scratch-card"),
  },
  {
    id: "egg-hatch",
    nameKey: "eggHatch",
    interactionType: "game",
    thumbnail: "🥚",
    component: () => import("./egg-hatch-card"),
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}
