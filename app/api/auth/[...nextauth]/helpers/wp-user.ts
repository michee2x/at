// helpers/wp-user.ts

import qs from "querystring";
import { WpUserMeta } from "./types";

const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;
const WP_USERNAME = process.env.WP_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;

/**
 * Get WordPress user by email
 */
export async function getWpUserByEmail(email: string): Promise<WpUserMeta | null> {
  try {
    const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

    const response = await fetch(
      `${WP_URL}wp-json/wp/v2/users?search=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const users = await response.json();

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    return {
      id: users[0].id,
      slug: users[0].slug,
      email,
    };
  } catch {
    return null;
  }
}

/**
 * Check if a user exists by email
 */
export async function checkUserExists(email?: string): Promise<boolean> {
  if (!email) return false;
  const user = await getWpUserByEmail(email);
  return !!user?.id;
}

/**
 * Create a new customer in WooCommerce/WordPress
 */
export async function createUserInWordPress(
  email: string,
  name: string
): Promise<{ id: number } | null> {
  try {
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      username: email.split("@")[0],
      password: process.env.WP_DEFAULT_APP_PASSWORD!,
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
      
      // User already exists - not an error
      if (body.includes("registration-error-email-exists")) {
        const existingUser = await getWpUserByEmail(email);
        return existingUser ? { id: existingUser.id } : null;
      }
      
      return null;
    }

    const data = await res.json();
    return { id: data.id };
  } catch {
    return null;
  }
}
