// app/api/wc-store/cart/token/route.ts
import { NextResponse } from "next/server";

const WC_STORE_URL = process.env.WC_API_URL!;

export async function GET() {
  try {
    const res = await fetch(`${WC_STORE_URL}/wp-json/wc/store/v1/cart`);
    const token = res.headers.get("cart-token");
    const cart = await res.json();
    console.log("Cart fetched with token:", token, cart);

    return NextResponse.json({ token, cart });
  } catch (err) {
    console.error("Error fetching cart token:", err);
    return NextResponse.json({ error: "Failed to get cart token" }, { status: 500 });
  }
}
