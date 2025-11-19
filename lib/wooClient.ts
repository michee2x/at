// lib/wooClient.ts
import qs from "querystring";

const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;

/**
 * Helper to call WooCommerce REST API with consumer key/secret (admin-level)
 * or with a WP JWT bearer token for user-scoped requests.
 */
export class WooClient {
  static async createCustomer(payload: {
    email: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    password?: string;
  }) {
    // Use consumer key & secret in query string (server-side only)
    const query = qs.stringify({
      consumer_key: WC_KEY,
      consumer_secret: WC_SECRET,
    });

    const res = await fetch(`${WP_URL}/wp-json/wc/v3/customers?${query}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to create customer: ${res.status} ${body}`);
    }
    return res.json();
  }

  // Use a WP bearer token (JWT) to fetch resources as the logged-in user
  static async getOrdersForUser(bearerToken: string) {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/orders`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      // note: you can pass query params e.g. ?customer=<id>
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to fetch orders: ${res.status} ${body}`);
    }
    return res.json();
  }

  static async getCustomerByEmail(email: string) {
    const query = qs.stringify({
      consumer_key: WC_KEY,
      consumer_secret: WC_SECRET,
      email,
    });

    const res = await fetch(`${WP_URL}/wp-json/wc/v3/customers?${query}`);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to get customer: ${res.status} ${body}`);
    }
    return res.json();
  }

  // Generic helper if you need other endpoints
  static async fetchWithConsumerAuth(path: string, opts?: RequestInit) {
    const query = qs.stringify({
      consumer_key: WC_KEY,
      consumer_secret: WC_SECRET,
    });

    const url = `${WP_URL}${path}${path.includes("?") ? "&" : "?"}${query}`;
    const res = await fetch(url, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts?.headers || {}),
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`WC fetch failed ${res.status}: ${body}`);
    }
    return res.json();
  }
}
