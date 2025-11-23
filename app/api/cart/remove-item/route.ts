import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("cart-token");
    const body = await req.text();

    if (!token) {
      return NextResponse.json({ error: "Missing Cart-Token" }, { status: 400 });
    }

    const res = await fetch(`${WC_URL}wp-json/wc/store/v1/cart/remove-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": token,
      },
      body,
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
