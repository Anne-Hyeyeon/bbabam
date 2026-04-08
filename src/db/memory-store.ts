// In-memory store for local testing without a database
// Uses globalThis to persist across HMR and module reloads in dev

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

interface MemoryData {
  cardIdCounter: number;
  cards: Card[];
  recipients: CardRecipient[];
  views: CardView[];
}

const globalData = globalThis as typeof globalThis & { __bbabam_memory?: MemoryData };

if (!globalData.__bbabam_memory) {
  globalData.__bbabam_memory = {
    cardIdCounter: 0,
    cards: [],
    recipients: [],
    views: [],
  };
}

const data = globalData.__bbabam_memory;

export const memoryStore = {
  createCard(cardData: Omit<Card, "id" | "createdAt">) {
    const card: Card = {
      ...cardData,
      id: String(++data.cardIdCounter),
      createdAt: new Date(),
    };
    data.cards.push(card);
    return card;
  },

  addRecipients(cardId: string, items: Array<{ name: string; nickname: string }>) {
    for (const item of items) {
      data.recipients.push({ id: String(Math.random()), cardId, ...item });
    }
  },

  getCardBySlug(slug: string) {
    return data.cards.find((c) => c.slug === slug) ?? null;
  },

  getRecipientsByCardId(cardId: string) {
    return data.recipients.filter((r) => r.cardId === cardId);
  },

  addView(cardId: string, viewerName: string | null, gamePlayed: string | null) {
    data.views.push({
      id: String(Math.random()),
      cardId,
      viewerName,
      gamePlayed,
      viewedAt: new Date(),
    });
  },

  getCardsByUserId(userId: string) {
    return data.cards
      .filter((c) => c.userId === userId)
      .map((c) => ({
        ...c,
        viewCount: data.views.filter((v) => v.cardId === c.id).length,
      }));
  },
};

export const isMemoryMode = !process.env.DATABASE_URL;
