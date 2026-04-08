import {
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["boy", "girl"]);
export const gameModeEnum = pgEnum("game_mode", ["fixed", "choice"]);
export const recipientModeEnum = pgEnum("recipient_mode", ["preset", "input"]);
export const tierEnum = pgEnum("tier", ["free", "premium"]);
export const gameTypeEnum = pgEnum("game_type", [
  "ice-cream",
  "balloon",
  "scratch",
  "roulette",
  "gift-box",
  "gacha",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  slug: text("slug").notNull().unique(),
  babyNickname: text("baby_nickname").notNull(),
  gender: genderEnum("gender").notNull(),
  dueDate: date("due_date"),
  gameMode: gameModeEnum("game_mode").notNull(),
  fixedGame: gameTypeEnum("fixed_game"),
  recipientMode: recipientModeEnum("recipient_mode").notNull(),
  language: text("language").notNull().default("ko"),
  tier: tierEnum("tier").notNull().default("free"),
  managementToken: text("management_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cardRecipients = pgTable("card_recipients", {
  id: uuid("id").defaultRandom().primaryKey(),
  cardId: uuid("card_id")
    .references(() => cards.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  nickname: text("nickname").notNull(),
});

export const cardViews = pgTable("card_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  cardId: uuid("card_id")
    .references(() => cards.id, { onDelete: "cascade" })
    .notNull(),
  viewerName: text("viewer_name"),
  gamePlayed: gameTypeEnum("game_played"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});
