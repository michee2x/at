/* eslint-disable */

// helpers/cart.ts
import { CartItem } from "./types";
import { mergeCartItems } from "./utils";

const WP_URL = process.env.WC_API_URL!;

/**
 * Fetch guest cart via cart_token
 */
export async function fetchGuestCart(cartToken: string): Promise<CartItem[]> {
  if (!cartToken) return [];

  const url = new URL(`${WP_URL}wp-json/wc/store/v1/cart`);
  url.searchParams.set("cart_token", cartToken);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data.items)
    ? data.items.map((i: any) => ({
        product_id: i.id,
        quantity: i.quantity,
      }))
    : [];
}

/**
 * Fetch logged-in user's cart via Bearer JWT
 */
export async function fetchUserCart(wpJwt: string): Promise<CartItem[]> {
  if (!wpJwt) return [];

  const res = await fetch(`${WP_URL}wp-json/wc/store/v1/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${wpJwt}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data.items)
    ? data.items.map((i: any) => ({
        product_id: i.id,
        quantity: i.quantity,
      }))
    : [];
}

/**
 * Save merged cart for logged-in user
 */
export async function saveUserCart(wpJwt: string, items: CartItem[]): Promise<void> {
  if (!wpJwt) return;

  // Clear existing cart
  const current = await fetchUserCart(wpJwt);
  for (const it of current) {
    await fetch(`${WP_URL}wp-json/wc/store/v1/cart/items/${it.product_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${wpJwt}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Add merged items
  for (const item of items) {
    await fetch(`${WP_URL}wp-json/wc/store/v1/cart/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${wpJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.product_id,
        quantity: item.quantity,
      }),
    });
  }
}

/**
 * Clear guest cart fully
 */
export async function clearGuestCart(cartToken: string): Promise<void> {
  if (!cartToken) return;

  const url = new URL(`${WP_URL}wp-json/wc/store/v1/cart`);
  url.searchParams.set("cart_token", cartToken);

  await fetch(url.toString(), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Full strict merge
 */
export async function mergeGuestCartIntoUserCart(
  cartToken: string,
  wpJwt: string
): Promise<CartItem[]> {
  const guest = await fetchGuestCart(cartToken);
  const user = await fetchUserCart(wpJwt);

  const merged = mergeCartItems(user, guest);

  await saveUserCart(wpJwt, merged);
  await clearGuestCart(cartToken);

  return merged;
}
