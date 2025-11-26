// helpers/wp-auth.ts
import { WpAuthResult } from "./types";


const WP_URL = process.env.WC_API_URL!;


export async function fetchWpNonce(username: string, password: string): Promise<string | null> {
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


export async function loginWordPressUser2(username: string, password: string): Promise<WpAuthResult> {
const res = await fetch(`${WP_URL}wp-json/jwt-auth/v1/token`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password }),
});


const data = await res.json();
if (!res.ok || !data.token) {
throw new Error(data.message || 'Failed WP auth');
}


return {
id: data.id,
user_display_name: data.user_display_name,
user_email: data.user_email,
token: data.token,
};
}

// lib/wp-login.ts

export async function loginWordPressUser(username: string, password: string) {
  try {
    // 1. LOGIN → get raw token
    const res = await fetch(`${WP_URL}wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log("[WP LOGIN RESPONSE]", data);

    if (!res.ok || !data?.token) {
      throw new Error(data.message || "Failed WordPress login");
    }

    const token = data.token;

    // 2. Fetch user data using the token
    const userRes = await fetch(`${WP_URL}wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = await userRes.json();
    console.log("[WP USER DATA]", userData);

    if (!userRes.ok || !userData?.id) {
      throw new Error("Failed to fetch WP user data");
    }

    // 3. Return the merged data
    const wpData:WpAuthResult = {
      id: userData.id,                       // REAL USER ID
      user_email: data.user_email,
      user_display_name: userData.name,
      token,                                  // WordPress JWT token
    }
    return wpData;

  } catch (error) {
    console.error("WP Login error:", error);
    return null;
  }
}

