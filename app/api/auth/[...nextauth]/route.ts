/* eslint-disable */
import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "next-auth";

import { loginWordPressUser } from "./helpers/wp-auth";
import { createUserInWordPress, getWpUserByEmail } from "./helpers/wp-user";
import type { CustomSession, CustomToken } from "./helpers/types";

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
// ─────────────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// ─────────────────────────────────────────────────────────────
// AUTH OPTIONS
// ─────────────────────────────────────────────────────────────

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    // ───── GOOGLE OAUTH ─────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ───── CREDENTIALS (Email/Password) ─────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        // Validate input
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Please enter your email and password");
        }

        const { username, password } = parsed.data;

        try {
          const wpUser = await loginWordPressUser(username, password);

          if (!wpUser) {
            throw new Error("The email or password you entered is incorrect");
          }

          // Return user object for NextAuth
          return {
            id: String(wpUser.id),
            email: wpUser.user_email,
            name: wpUser.user_display_name,
            wpToken: wpUser.token,
            wpUserId: wpUser.id,
          } as User & { wpToken: string; wpUserId: number };

        } catch (error: any) {
          // Re-throw with user-friendly message
          if (error.message?.includes("incorrect") || error.message?.includes("Invalid")) {
            throw new Error("The email or password you entered is incorrect");
          }
          throw new Error("Unable to sign in. Please try again later");
        }
      },
    }),
  ],

  callbacks: {
    // ─────────────────────────────────────────────────────────────
    // JWT CALLBACK - Runs when JWT is created/updated
    // ─────────────────────────────────────────────────────────────
    async jwt({ token, user, account }): Promise<CustomToken> {
      const t = token as CustomToken;

      // ───── CREDENTIALS LOGIN ─────
      if (account?.provider === "credentials" && user) {
        const u = user as User & { wpToken: string; wpUserId: number };
        
        t.jwt = u.wpToken;
        t.wpUserId = u.wpUserId;
        t.email = u.email!;
        t.name = u.name!;
        t.google = false;
        
        return t;
      }

      // ───── GOOGLE LOGIN ─────
      if (account?.provider === "google" && user) {
        const email = user.email || "";
        const name = user.name || "";
        const username = email.split("@")[0]; // WP username is the email prefix

        t.google = true;
        t.email = email;
        t.name = name;

        // Check if WordPress user exists
        let wpUser = await getWpUserByEmail(email);

        // Create new WP user if not found
        if (!wpUser?.id) {
          const newUser = await createUserInWordPress(email, name);
          if (newUser?.id) {
            wpUser = { id: newUser.id, slug: username, email };
          }
        }

        t.wpUserId = wpUser?.id;

        // Get WP token for Google user
        // IMPORTANT: Use username (email prefix), not full email!
        // WP users created for Google OAuth use the email prefix as username
        try {
          const defaultAppPassword = process.env.WP_DEFAULT_APP_PASSWORD!;
          const wpAuth = await loginWordPressUser(username, defaultAppPassword);
          t.jwt = wpAuth?.token || "";
        } catch {
          t.jwt = "";
        }

        return t;
      }

      // ───── RETURN EXISTING TOKEN ─────
      return t;
    },

    // ─────────────────────────────────────────────────────────────
    // SESSION CALLBACK - Shapes the session object
    // ─────────────────────────────────────────────────────────────
    async session({ session, token }): Promise<CustomSession> {
      const t = token as CustomToken;

      return {
        ...session,
        wpToken: t.jwt,
        google: t.google,
        user: {
          id: t.wpUserId ? String(t.wpUserId) : "",
          name: t.name ?? session.user?.name ?? "",
          email: t.email ?? session.user?.email ?? "",
        },
      } as CustomSession;
    },

    // ─────────────────────────────────────────────────────────────
    // SIGN IN CALLBACK
    // ─────────────────────────────────────────────────────────────
    async signIn() {
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

// ─────────────────────────────────────────────────────────────
// EXPORT HANDLERS
// ─────────────────────────────────────────────────────────────

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
