// app/api/wc-store/cart/items/[key]/route.ts
import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!; // e.g. "https://atlaze.com/"

// PUT -> update quantity, DELETE -> delete single item
export async function PUT(req: NextRequest, context: { params: { key: string } }) {
  const { key } = context.params;
  try {
    const quantityStr = new URL(req.url).searchParams.get("quantity");
    if (!quantityStr) return NextResponse.json({ error: "Missing quantity" }, { status: 400 });

    const token = req.headers.get("cart-token");
    if (!token) return NextResponse.json({ error: "Missing Cart-Token" }, { status: 400 });

    console.log(`WC-DEBUG | Updating cart item ${key} -> quantity=${quantityStr}`);

    const res = await fetch(
      `${WC_URL}wp-json/wc/store/v1/cart/items/${encodeURIComponent(key)}?quantity=${encodeURIComponent(quantityStr)}`,
      {
        method: "PUT",
        headers: {
          "Cart-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("WC-ERROR | update item:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { key: string } }) {
  const { key } = context.params;
  try {
    const token = req.headers.get("cart-token");
    if (!token) return NextResponse.json({ error: "Missing Cart-Token" }, { status: 400 });

    console.log(`WC-DEBUG | Deleting cart item ${key}`);

    const res = await fetch(`${WC_URL}wp-json/wc/store/v1/cart/items/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        "Cart-Token": token,
      },
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("WC-ERROR | delete item:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
