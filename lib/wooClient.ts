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
    role?: string;
    meta_data?: Array<{ key: string; value: string }>;
  }) {
    // 1. Create User via WP API (Reliable for Roles)
    const username = process.env.WP_USERNAME;
    const password = process.env.WP_APP_PASSWORD;
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    console.log('[WooClient] 1. Creating user via WP API...');
    
    // We strictly use WP API for User + Role. Meta is handled next.
    const wpPayload = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      first_name: payload.first_name,
      last_name: payload.last_name,
      roles: payload.role ? [payload.role] : ['customer'], 
    };

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(wpPayload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[WooClient] Create user failed:', res.status, body);
      // Handle "Existing user" error gracefully if needed, or throw
      throw new Error(`Failed to create user: ${res.status} ${body}`);
    }

    const newUser = await res.json();
    const newUserId = newUser.id;
    console.log('[WooClient] User created. ID:', newUserId);

    // 2. If we have meta_data (Vendor info), update via WooCommerce API (Reliable for Meta)
    if (payload.meta_data && payload.meta_data.length > 0) {
      console.log('[WooClient] 2. Updating metadata via WC API...');
      const query = qs.stringify({
        consumer_key: WC_KEY,
        consumer_secret: WC_SECRET,
      });

      const updatePayload = {
        meta_data: payload.meta_data
      };

      const metaRes = await fetch(`${WP_URL}/wp-json/wc/v3/customers/${newUserId}?${query}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!metaRes.ok) {
        const body = await metaRes.text();
        console.error('[WooClient] Meta update failed:', metaRes.status, body);
        // We log but don't throw, so the user can still login.
      } else {
        console.log('[WooClient] Metadata updated successfully.');
      }
    }
    
    return newUser;
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
