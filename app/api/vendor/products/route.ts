import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const WP_URL = process.env.WC_API_URL!;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Check for authenticated user with a valid token and ID
  if (!session?.user?.id || !session?.wpToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "20";
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const slug = searchParams.get("slug");

    // Use Dokan API directly with the User's Token.
    // Endpoint: /wp-json/dokan/v1/products
    let endpoint = `${WP_URL}/wp-json/dokan/v1/products?page=${page}&per_page=${per_page}`;

    if (status && status !== 'all') endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${search}`;
    if (slug) endpoint += `&slug=${slug}`;

    const res = await fetch(endpoint,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.wpToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[API] Dokan API Error:", res.status, errorText);

      // If Dokan API 404s (plugin not active?) or 403 (capabilities?), fallback or error.
      // But we should surface this.
      return new NextResponse(`Vendor API Error: ${errorText}`, { status: res.status });
    }

    const products = await res.json();
    return NextResponse.json(products);

  } catch (error) {
    console.error("[API] Error fetching vendor products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
