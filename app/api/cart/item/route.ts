import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!;
const WC_STORE_API = `${WC_URL}/wp-json/wc/store/cart`;

export async function POST(req: NextRequest) {
  try {
    const wpJwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!wpJwt) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const body = await req.json();
    const { id, quantity } = body;

    const res = await fetch(`${WC_STORE_API}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${wpJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, quantity }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(err, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
