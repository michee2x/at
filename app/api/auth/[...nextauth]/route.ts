/* eslint-disable */

import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import qs from "querystring";

// Zod schema for credentials
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

// Extend session with custom fields
interface CustomSession extends Session {
  wpToken?: string;
  wpNonce?: string; // NEW: WP store nonce
  google?: boolean;
  user: {
    name?: string;
    email?: string;
  };
}

const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;

// ------------------------------
// Helper to fetch WP store nonce
// ------------------------------
async function fetchWpNonce(username: string, password: string): Promise<string | null> {
  try {
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const res = await fetch(`${WP_URL}wp-json/wc/store/v1/cart`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });
    return res.headers.get("X-WC-Store-API-Nonce");
  } catch (err) {
    console.error("Failed to fetch WP nonce:", err);
    return null;
  }
}

// ------------------------------
// NextAuth configuration
// ------------------------------
const handler = NextAuth({
  providers: [
    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // WordPress credentials login
    CredentialsProvider({
      name: "WordPress",
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        try {
          const res = await fetch(`${WP_URL}wp-json/jwt-auth/v1/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          const data = await res.json();
          console.log("WP Response:", data);

          if (!res.ok || !data.token) {
            if (data.code === "[jwt_auth] invalid_username") {
              throw new Error("Invalid username or email address.");
            }
            if (data.code === "[jwt_auth] invalid_password") {
              throw new Error("Incorrect password. Please try again.");
            }
            throw new Error(data.message || "An unknown error occurred.");
          }

          // Return WP user info + original credentials (needed for nonce)
          return {
            id: data.id,
            name: data.user_display_name,
            email: data.user_email,
            token: data.token,
            username,
            password, // <--- Keep this to fetch nonce later
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error during WP login:", error.message);
            throw new Error(error.message || "Error logging in.");
          } else {
            console.error("Unknown error during WP login:", error);
            throw new Error("An unexpected error occurred.");
          }
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      // -------------------
      // Google login
      // -------------------
      if (account?.provider === "google") {
        const userEmail = user?.email ?? '';
        const userName = user?.name ?? '';

        const userExists = await checkUserExists(userEmail);
        if (!userExists) await createUserInWordPress(userEmail, userName);

        token["google"] = true;
        token["email"] = userEmail;
        token["name"] = userName;

        // Optional: fetch WP nonce for Google user if WP account exists
        const wpUser = await getWpUserByEmail(userEmail);
        if (wpUser?.username && wpUser?.password) {
          const nonce = await fetchWpNonce(wpUser.username, wpUser.password);
          if (nonce) token["wpNonce"] = nonce;
        }
      }

      // -------------------
      // WordPress credentials login
      // -------------------
      if (user?.token) {
        token["jwt"] = user.token;
        token["name"] = user.name ?? undefined;
        token["email"] = user.email ?? undefined;

        // Fetch WP nonce using stored username/password
        if ((user as any).username && (user as any).password) {
          const nonce = await fetchWpNonce((user as any).username, (user as any).password);
          if (nonce) token["wpNonce"] = nonce;
        }
      }

      return token;
    },

    async session({ session, token }): Promise<CustomSession> {
      const s = session as CustomSession;

      s.user = s.user || {};
      s.wpToken = token["jwt"] as string | undefined;
      s.wpNonce = token["wpNonce"] as string | undefined; // NEW
      s.google = token["google"] as boolean | undefined;
      s.user.name = token["name"] ?? '';
      s.user.email = token["email"] ?? '';

      return s;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET!,
});

export { handler as GET, handler as POST };

// ------------------------------
// Helper functions for WP user check/signup
// ------------------------------
async function checkUserExists(email: string | undefined) {
  if (!email) return false;
  const response = await fetch(`${WP_URL}wp-json/wp/v2/users?search=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const users = await response.json();
  return users.length > 0;
}

async function createUserInWordPress(email: string, name: string) {
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[1] : '';

  const payload = {
    email,
    first_name: firstName,
    last_name: lastName,
    username: email.split("@")[0],
    password: generateRandomPassword(),
  };

  const query = qs.stringify({
    consumer_key: WC_KEY,
    consumer_secret: WC_SECRET,
  });

  const res = await fetch(`${WP_URL}wp-json/wc/v3/customers?${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    if (body.includes("registration-error-email-exists")) {
      console.log(`User already exists: ${email}`);
      return null;
    }
    throw new Error(`Failed to create customer: ${res.status} ${body}`);
  }

  const createdUser = await res.json();
  console.log("User successfully created in WordPress:", createdUser);
  return createdUser;
}

function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}

// Optional helper to get WP username/password for Google users
async function getWpUserByEmail(email: string) {
  const response = await fetch(`${WP_URL}wp-json/wp/v2/users?search=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const users = await response.json();
  if (!users || users.length === 0) return null;

  // Return username and a placeholder password for nonce fetch
  // If you have a better way to get actual password, replace this
  return { username: users[0].slug, password: "placeholder-password" };
}
