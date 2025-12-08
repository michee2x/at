import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parent = searchParams.get("parent") || "0"; // default to 0

  const url = `https://atlaze.com/wp-json/wc/v3/products/categories?parent=${parent}`;
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;

  try {
    console.log("Fetching Categories from WooCommerce API:", url);
    if (!key || !secret) {
      throw new Error(`Missing WooCommerce API credentials`);
    }

    const res = await fetch(url, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const categories = await res.json();
    return NextResponse.json(categories);
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
