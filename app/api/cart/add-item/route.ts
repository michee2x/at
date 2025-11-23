import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!;

// Minimal safe type for WooCommerce Store API responses
interface WooStoreResponse {
  message?: string;
  code?: string;
  data?: unknown;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("cart-token");
    const body = await req.text();

    if (!token) {
      return NextResponse.json(
        { error: "Missing Cart-Token" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${WC_URL}wp-json/wc/store/v1/cart/add-item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cart-Token": token,
        },
        body,
      }
    );

    // Cast safely to WooStoreResponse (not `any`)
    const json = (await res.json()) as WooStoreResponse;

    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}
