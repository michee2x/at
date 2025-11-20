import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

// Zod schema for credentials
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

// Extend session with custom fields
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "WordPress",
      credentials: { username: {}, password: {} },
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

          const data = await res.json();
          if (!res.ok || !data.token) return null;

          return {
            id: data.id,
            name: data.user_display_name,
            email: data.user_email,
            token: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // JWT callback
    async jwt({ token, user, account }) {
      // Google login
      if (account?.provider === "google") token["google"] = true;

      // WordPress login
      if (user?.token) {
        token["jwt"] = user.token;
        token["name"] = user.name ?? undefined; // coerce null -> undefined
        token["email"] = user.email ?? undefined;
      }

      return token; // still of type JWT, safe for TS
    },

    // Session callback
    async session({ session, token }): Promise<CustomSession> {
      const s = session as CustomSession;

      s.user = s.user || {};
      s.wpToken = token["jwt"] as string | undefined;
      s.google = token["google"] as boolean | undefined;
      s.user.name = (token.name as string | undefined) ?? undefined;
      s.user.email = (token.email as string | undefined) ?? undefined;

      return s;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
