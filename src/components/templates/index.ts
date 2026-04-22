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
  component: () => Promise<{ default: ComponentType<TemplateInteractionProps> }>;
}

export const templates: CardTemplate[] = [
  {
    id: "scratch",
    nameKey: "scratch",
    interactionType: "scratch",
    thumbnail: "🎫",
    component: () => import("./scratch-card"),
  },
  {
    id: "flip",
    nameKey: "flip",
    interactionType: "flip",
    thumbnail: "🃏",
    component: () => import("./flip-card"),
  },
  {
    id: "envelope",
    nameKey: "envelope",
    interactionType: "envelope",
    thumbnail: "✉️",
    component: () => import("./envelope-card"),
  },
  {
    id: "castle-quest",
    nameKey: "castleQuest",
    interactionType: "game",
    thumbnail: "🏰",
    component: () => import("./castle-quest-card"),
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}
