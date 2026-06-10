import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function findUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0] ?? null;
}

async function ensureUserExists(email: string, name: string | null, provider: string) {
  const existing = await findUserByEmail(email);
  if (existing) return;
  await db.insert(users).values({ email, name, provider });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false;
      await ensureUserExists(user.email, user.name ?? null, account.provider);
      return true;
    },
    async session({ session }) {
      if (!session.user?.email) return session;
      const dbUser = await findUserByEmail(session.user.email);
      return dbUser
        ? { ...session, user: { ...session.user, id: dbUser.id } }
        : session;
    },
  },
});
