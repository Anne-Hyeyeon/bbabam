import type { ComponentType } from "react";
import type { Thumbnail } from "@/components/home/thumbnail";

export interface TemplateInteractionProps {
  gender: "boy" | "girl";
  babyNickname: string;
  recipientName?: string;
  /** Expected due date as YYYY-MM-DD; shown in the reveal copy when present. */
  dueDate?: string;
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

// GPT-designed webp thumbnails are parked in public/thumbnails; the picker
// renders every template in the phrase + 3D-icon poster style instead.
export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    component: () => import("./scratch-card"),
  },
  {
    id: "omurice",
    nameKey: "omurice",
    interactionType: "dialog",
    component: () => import("./omurice-card"),
  },
  {
    id: "egg-hatch",
    nameKey: "eggHatch",
    interactionType: "game",
    component: () => import("./egg-hatch-card"),
  },
  {
    id: "gift-box",
    nameKey: "giftBox",
    interactionType: "game",
    component: () => import("./gift-box-card"),
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}
