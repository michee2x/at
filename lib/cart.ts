// lib/cart.ts
export async function getCartToken() {
  const res = await fetch(`${process.env.WC_API_URL}/wp-json/wc/store/v1/cart`);
  const token = res.headers.get("cart-token");
  const cart = await res.json();
  console.log("Cart fetched:", cart, "Cart-Token:", token);
  return { token, cart };
}
