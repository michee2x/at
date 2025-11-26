import { CartResponse, CartItem } from "@/types/cart";

// Fetch guest cart from local API or localStorage
export async function fetchGuestCart(cartToken: string): Promise<CartResponse> {
  const res = await fetch("/api/cart/get", { headers: { "Cart-Token": cartToken } });
  if (!res.ok) throw new Error("Failed to fetch guest cart");
  return res.json();
}

// Fetch user cart from WP user meta
export async function fetchUserCart(userId: number): Promise<CartResponse> {
  const res = await fetch("/api/cart/user-cart", {
    headers: { "User-Id": String(userId) },
  });
  if (!res.ok) throw new Error("Failed to fetch user cart");
  return res.json();
}

// Save user cart to WP user meta
export async function saveUserCart(userId: number, items: CartItem[]): Promise<void> {
  await fetch("/api/cart/user-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, items }),
  });
}

// Merge guest items into user cart
export function mergeCartItems(userItems: CartItem[], guestItems: CartItem[]): CartItem[] {
  const map = new Map<number, CartItem>();
  userItems.forEach((i) => map.set(i.id, { ...i }));
  guestItems.forEach((i) => {
    if (map.has(i.id)) {
      map.get(i.id)!.quantity += i.quantity;
    } else {
      map.set(i.id, { ...i });
    }
  });
  return Array.from(map.values());
}

// Merge guest cart to user meta
export async function mergeGuestCartToUser(userId: number, guestCartItems: CartItem[]): Promise<CartItem[]> {
  const userCart = await fetchUserCart(userId);
  const mergedItems = mergeCartItems(userCart.items, guestCartItems);
  await saveUserCart(userId, mergedItems);
  return mergedItems;
}
