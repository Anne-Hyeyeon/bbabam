export type CardAudience =
  | "parents"
  | "spouse"
  | "friends"
  | "workplace"
  | "special";

export type CardTone = "formal" | "casual" | "emotional" | "witty" | "minimal";

export interface CardMessage {
  id: string;
  audience: CardAudience;
  audienceLabel: string;
  style: string;
  content: string;
  tone: CardTone;
}
