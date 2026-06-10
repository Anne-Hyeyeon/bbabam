import type { ComponentType } from "react";
import type { Thumbnail } from "@/components/home/thumbnail";

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
  /**
   * Picker thumbnail, sharing the home thumbnail asset model
   * (resolved against the "wide" slot). Baked images hide the text overlay.
   */
  thumbnail?: Thumbnail;
  component: () => Promise<{ default: ComponentType<TemplateInteractionProps> }>;
}

export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    thumbnail: {
      kind: "image",
      images: { wide: "gender-reveal-lottery.png" },
      localized: true,
      textMode: "baked",
    },
    component: () => import("./scratch-card"),
  },
  {
    id: "egg-hatch",
    nameKey: "eggHatch",
    interactionType: "game",
    component: () => import("./egg-hatch-card"),
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}
