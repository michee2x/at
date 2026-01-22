// helpers/wp-auth.ts

import { WpAuthResult } from "./types";

const WP_URL = process.env.WC_API_URL!;

/**
 * Authenticate user with WordPress JWT plugin
 * Returns user data + JWT token on success, null on failure
 */
export async function loginWordPressUser(
  username: string,
  password: string
): Promise<WpAuthResult | null> {
  try {
    // Step 1: Get JWT token
    const tokenRes = await fetch(`${WP_URL}wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData?.token) {
      console.error("[WP_AUTH] Token fetch failed:", {
        status: tokenRes.status,
        url: `${WP_URL}wp-json/jwt-auth/v1/token`,
        username, // Log username to verify correct one is used
        error: tokenData
      });
      return null;
    }

    const token = tokenData.token;

    // Step 2: Fetch user details using the token
    // We use context=edit to ensure we get the 'roles' field
    const userRes = await fetch(`${WP_URL}wp-json/wp/v2/users/me?context=edit`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = await userRes.json();

    if (!userRes.ok || !userData?.id) {
      console.error("[WP_AUTH] User data fetch failed:", {
        status: userRes.status,
        error: userData
      });
      return null;
    }

    console.log("[WP_AUTH] Login success for:", username, "UserId:", userData.id, "Token length:", token?.length, "Roles:", userData.roles);

    // Determine primary role
    const roles = userData.roles || [];
    
    // Check for any vendor-like role
    const isVendor = roles.some((r: string) => ['seller', 'vendor', 'dokan_vendor'].includes(r));
    const isAdmin = roles.includes('administrator');

    let role = 'customer';
    if (isAdmin) {
      role = 'administrator';
    } else if (isVendor) {
      role = 'seller';
    } else {
      role = roles[0] || 'customer';
    }
    
    console.log("[WP_AUTH] Role determined:", role, "from roles:", roles);

    // Step 3: Return combined result
    return {
      id: userData.id,
      user_email: tokenData.user_email,
      user_display_name: userData.name || tokenData.user_display_name,
      token,
      role,
    };
  } catch (err) {
    console.error("[WP_AUTH] Network/System error:", err);
    return null;
  }
}

/**
 * Fetch WooCommerce Store API nonce for cart operations
 */
export async function fetchWpNonce(
  username: string,
  password: string
): Promise<string | null> {
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
  } catch {
    return null;
  }
}
