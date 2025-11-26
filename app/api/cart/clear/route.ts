import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!;
const WC_STORE_API = `${WC_URL}/wp-json/wc/store/cart`;

export async function POST(req: NextRequest) {
  try {
    const cartToken = req.headers.get("Cart-Token");
    if (!cartToken) {
      return NextResponse.json({ error: "Missing cart token" }, { status: 400 });
    }

    // Call WooCommerce Store API to empty the cart for the guest token
    const res = await fetch(`${WC_STORE_API}/items`, {
      method: "DELETE",
      headers: {
        "Cart-Token": cartToken,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(err, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("clear cart error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
