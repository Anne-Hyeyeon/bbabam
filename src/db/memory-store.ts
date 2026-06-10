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

const buildCard = (
  cardData: Omit<Card, "id" | "createdAt">,
  id: string,
  createdAt: Date,
): Card => ({ ...cardData, id, createdAt });

const withoutCard = (cards: Card[], id: string, userId: string): Card[] =>
  cards.filter((c) => !(c.id === id && c.userId === userId));

// The store is the single mutation boundary: state changes happen only
// here, by replacing the cards array with a new immutable snapshot.
export const memoryStore = {
  createCard(cardData: Omit<Card, "id" | "createdAt">) {
    const card = buildCard(cardData, String(data.cardIdCounter + 1), new Date());
    data.cardIdCounter += 1;
    data.cards = [...data.cards, card];
    return card;
  },

  getCardBySlug(slug: string) {
    return data.cards.find((c) => c.slug === slug) ?? null;
  },

  getCardsByUserId(userId: string) {
    return data.cards.filter((c) => c.userId === userId);
  },

  deleteCard(id: string, userId: string) {
    data.cards = withoutCard(data.cards, id, userId);
  },
};

export const isMemoryMode = !process.env.DATABASE_URL;
