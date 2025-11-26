/* eslint-disable */
import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "next-auth";

import { fetchWpNonce, loginWordPressUser } from "./helpers/wp-auth";
import {
  checkUserExists,
  createUserInWordPress,
  getWpUserByEmail,
} from "./helpers/wp-user";

import type {
  CustomSession,
  CustomToken,
  WpAuthResult,
} from "./helpers/types";
import { toNumber } from "@/utils/to-number";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "WordPress",
      credentials: { username: {}, password: {} },

      async authorize(credentials): Promise<User | null> {
        console.log("[AUTH] Credentials authorize() called");

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log("[AUTH] Credentials Zod parse failed");
          return null;
        }

        const { username, password } = parsed.data;
        console.log("[AUTH] Credentials login attempt for:", username);

        try {
          const wp = await loginWordPressUser(username, password);

if (!wp) {
  throw new Error("Invalid username or password");
}
          console.log("\n\n\n\n\n\n\n\n\n\n\n\n\[AUTH] loginWordPressUser response:", {
            id: wp.id,
            email: wp.user_email,
            name: wp.user_display_name,
          });

          const user: User & {
            wpToken: string;
            wpUserId: number;
            wpUsername: string;
            wpPassword: string;
          } = {
            id: String(wp.id),
            email: wp.user_email,
            name: wp.user_display_name,
            wpToken: wp.token,
            wpUserId: wp.id,
            wpUsername: username,
            wpPassword: password,
          };

          return user;
        } catch (e: any) {
          console.log("[AUTH] Credentials login FAILED:", e.message);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // -----------------------------
    // JWT CALLBACK
    // -----------------------------
    async jwt({ token, user, account }): Promise<CustomToken> {
      const t = token as CustomToken;

      console.log("\n========== [AUTH] JWT CALLBACK ==========");
      console.log("[AUTH] Provider:", account?.provider);
      console.log("[AUTH] Incoming token:", t);
      console.log("[AUTH] Incoming user:", user);

      const u = user as User & {
    wpToken: string;
    wpUserId: number;
  };

      // ----------- CREDENTIALS LOGIN -----------
      if (account?.provider === "credentials" && user) {
  console.log("[AUTH] Handling CREDENTIALS login inside JWT");


  console.log("[AUTH] Credentials user data:", {
    wpUserId: u.wpUserId,
    email: u.email,
    name: u.name,
  });

  // 🟢 Store all essential user fields into the token
  t.jwt = u.wpToken;
  t.wpUserId = u.wpUserId;
  t.email = u.email!;
  t.name = u.name!;

  console.log("[AUTH] Stored wpUserId:", t.wpUserId);

  return t;
}


      // ----------- GOOGLE LOGIN -----------
      if (account?.provider === "google" && user) {
  console.log("[AUTH] Handling GOOGLE login inside JWT");

  const email = user.email || "";
  const name = user.name || "";

  console.log("[AUTH] Google user:", { email, name });

  t.google = true;
  t.email = email;
  t.name = name;

  // Check if WP user exists
  let wpUser = await getWpUserByEmail(email);
  console.log("[AUTH] WP user lookup:", wpUser);

  if (!wpUser?.id) {
    console.log("[AUTH] WP user not found—creating new one...");
    const newId = await createUserInWordPress(email, name);
    console.log("[AUTH] WP new user creation result:", newId);
    if (newId) {
      wpUser = { id: newId, slug: email.split("@")[0], email }; // minimal WP user object
    }
  }

  t.wpUserId = wpUser?.id;

  console.log("[AUTH] FINAL wpUserId for Google:", t.wpUserId);

  // Log in to WP using default app password from .env
  try {
    const defaultAppPassword = process.env.WP_DEFAULT_APP_PASSWORD!;
    const wpAuth = await loginWordPressUser(email, defaultAppPassword);
    t.jwt = wpAuth?.token || ""; // assign JWT from WP
    console.log("[AUTH] WP JWT for Google user:", t.jwt);
  } catch (err) {
    console.warn("[AUTH] Failed to login Google user to WP:", err);
    t.jwt = ""; // fallback
  }

  return t;
}


      // ----------- DEFAULT -----------
      console.log("[AUTH] Returning existing JWT token:", t);
      return t;
    },

    // -----------------------------
    // SESSION CALLBACK
    // -----------------------------
    async session({ session, token }): Promise<any> {
      console.log("\n========== [AUTH] SESSION CALLBACK ==========");
      console.log("[AUTH] Incoming token to session:", token);

      const s = session as CustomSession;
      const t = token as CustomToken;

      s.wpToken = t.jwt;
      s.wpNonce = t.wpNonce;
      s.google = t.google;

      s.user = {
        name: t.name ?? session.user?.name ?? "",
        email: t.email ?? session.user?.email ?? "",
        id: t.wpUserId ? String(t.wpUserId) : "",
      };

      console.log("[AUTH] Final session object:", s);
      console.log("=============================================\n");

      return s;
    },

    async signIn() {
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
