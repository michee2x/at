// lib/cartToken.ts
export async function getCartToken(): Promise<string> {
  // Check localStorage first
  let token = typeof window !== "undefined" ? localStorage.getItem("cartToken") : null;

  if (!token) {
    // Fetch from backend if not in localStorage
    const res = await fetch("/api/wc-store/cart/token");
    const data = await res.json();

    token = data.token;

    // Save for future use
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("cartToken", token);
    }
  }

  return token!;
}
