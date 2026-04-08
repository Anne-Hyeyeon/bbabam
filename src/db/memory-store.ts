// In-memory store for local testing without a database

interface Card {
  id: string;
  userId: string | null;
  slug: string;
  babyNickname: string;
  gender: "boy" | "girl";
  dueDate: string | null;
  gameMode: "fixed" | "choice";
  fixedGame: string | null;
  recipientMode: "preset" | "input";
  language: string;
  tier: "free" | "premium";
  managementToken: string | null;
  createdAt: Date;
}

interface CardRecipient {
  id: string;
  cardId: string;
  name: string;
  nickname: string;
}

interface CardView {
  id: string;
  cardId: string;
  viewerName: string | null;
  gamePlayed: string | null;
  viewedAt: Date;
}

let cardIdCounter = 0;

const cards: Card[] = [];
const recipients: CardRecipient[] = [];
const views: CardView[] = [];

export const memoryStore = {
  createCard(data: Omit<Card, "id" | "createdAt">) {
    const card: Card = {
      ...data,
      id: String(++cardIdCounter),
      createdAt: new Date(),
    };
    cards.push(card);
    return card;
  },

  addRecipients(cardId: string, items: Array<{ name: string; nickname: string }>) {
    for (const item of items) {
      recipients.push({ id: String(Math.random()), cardId, ...item });
    }
  },

  getCardBySlug(slug: string) {
    return cards.find((c) => c.slug === slug) ?? null;
  },

  getRecipientsByCardId(cardId: string) {
    return recipients.filter((r) => r.cardId === cardId);
  },

  addView(cardId: string, viewerName: string | null, gamePlayed: string | null) {
    views.push({
      id: String(Math.random()),
      cardId,
      viewerName,
      gamePlayed,
      viewedAt: new Date(),
    });
  },

  getCardsByUserId(userId: string) {
    return cards
      .filter((c) => c.userId === userId)
      .map((c) => ({
        ...c,
        viewCount: views.filter((v) => v.cardId === c.id).length,
      }));
  },
};

export const isMemoryMode = !process.env.DATABASE_URL;
