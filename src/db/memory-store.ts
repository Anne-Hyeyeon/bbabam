// In-memory store for local testing without a database
// Uses globalThis to persist across HMR and module reloads in dev

interface Card {
  id: string;
  userId: string | null;
  slug: string;
  templateId: string;
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName: string | null;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl: string | null;
  language: string;
  createdAt: Date;
}

interface MemoryData {
  cardIdCounter: number;
  cards: Card[];
}

const globalData = globalThis as typeof globalThis & { __bbabam_memory?: MemoryData };

if (!globalData.__bbabam_memory) {
  globalData.__bbabam_memory = {
    cardIdCounter: 0,
    cards: [],
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

  getCardBySlug(slug: string) {
    return data.cards.find((c) => c.slug === slug) ?? null;
  },

  getCardsByUserId(userId: string) {
    return data.cards.filter((c) => c.userId === userId);
  },

  deleteCard(id: string, userId: string) {
    const index = data.cards.findIndex((c) => c.id === id && c.userId === userId);
    if (index !== -1) {
      data.cards.splice(index, 1);
    }
  },
};

export const isMemoryMode = !process.env.DATABASE_URL;
