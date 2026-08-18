import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  secret: process.env.AUTH_SECRET,

  // NextAuth v5 rejects sign-in attempts from a host it doesn't recognize
  // ("UntrustedHost" error) unless AUTH_URL matches exactly or trustHost is
  // set. This is one of the most common causes of login silently failing
  // in dev (wrong port) or behind a proxy (Vercel, Docker) in production.
  trustHost: true,

  pages: {
    error: "/login",
  },
});