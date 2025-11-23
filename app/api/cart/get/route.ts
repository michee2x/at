import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_API_URL!;

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("cart-token");
    console.log('this is the cart tokennn: ', token)

    if (!token) {
      return NextResponse.json({ error: "Missing Cart-Token" }, { status: 400 });
    }

    const res = await fetch(`${WC_URL}wp-json/wc/store/v1/cart`, {
      method: "GET",
      headers: {
        "Cart-Token": token,
      },
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}


//curl --header "Cart-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidF9hODEyMjExYTdlNzVjODBmNmVlZjMwNTgzMzFiZTIiLCJleHAiOjE3NjM5NzY2OTgsImlzcyI6InN0b3JlLWFwaSIsImlhdCI6MTc2MzgwMzg5OH0.r6Ah4CLcL5jCLhi7VyBDlHKaN9KaZsqMafTM1NAH16M" --request GET https://example-store.com/wp-json/wc/store/v1/cart