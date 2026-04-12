import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["boy", "girl"]);
export const recipientModeEnum = pgEnum("recipient_mode", ["preset", "input"]);
export const ogModeEnum = pgEnum("og_mode", ["default", "fake-surprise"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  templateId: text("template_id").notNull(),
  babyNickname: text("baby_nickname").notNull(),
  gender: genderEnum("gender").notNull(),
  recipientMode: recipientModeEnum("recipient_mode").notNull(),
  recipientName: text("recipient_name"),
  ogMode: ogModeEnum("og_mode").notNull().default("default"),
  ultrasoundImageUrl: text("ultrasound_image_url"),
  language: text("language").notNull().default("ko"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
