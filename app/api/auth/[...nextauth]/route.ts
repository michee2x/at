import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

// Extend the token type
interface CustomToken extends Record<string, any> {
  jwt?: string;
  google?: boolean;
  name?: string;
  email?: string;
}

interface CustomSession extends Session {
  wpToken?: string;
  google?: boolean;
  user: {
    name?: string;
    email?: string;
  };
}

const handler = NextAuth({
  providers: [
    // Google auth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // WordPress JWT / Credentials login
    CredentialsProvider({
      name: "WordPress",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        try {
          const res = await fetch(
            `${process.env.WC_API_URL}wp-json/jwt-auth/v1/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            }
          );

          console.log(
            "WORDPRESS TOKEN URL:",
            `${process.env.WC_API_URL}/wp-json/jwt-auth/v1/token`
          );
          console.log("STATUS:", res.status);

          const data = await res.json();
          if (!res.ok || !data.token) return null;

          return {
            id: data.id,
            name: data.user_display_name,
            email: data.user_email,
            token: data.token, // custom field
          };
        } catch (e) {
          console.error("WordPress login error:", e);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
  async jwt({ token, user, account }) {
    const t = token as CustomToken;

    if (account?.provider === "google") {
      t.google = true;
    }

    if (user?.token) {
      t.jwt = user.token;
      t.name = user.name ?? undefined; // coerce null -> undefined
      t.email = user.email ?? undefined; // coerce null -> undefined
    }

    return t;
  },

  async session({ session, token }) {
    const s = session as CustomSession;
    const t = token as CustomToken;

    s.user = s.user || {};
    if (t.jwt) s.wpToken = t.jwt;
    if (t.google) s.google = true;
    if (t.name) s.user.name = t.name;
    if (t.email) s.user.email = t.email;

    return s;
  },
},


  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
