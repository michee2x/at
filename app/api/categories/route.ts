import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_API_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const parent = searchParams.get("parent");
    const search = searchParams.get("search") || "";
    const perPage = searchParams.get("per_page") || "20";

    // Typed params
    const params: Record<string, string | number> = {
      per_page: Number(perPage),
    };

    if (search) params.search = search;
    if (parent) params.parent = parent;

    // If slug is provided, find its ID and fetch its children
    if (slug) {
      const { data: categoryData }: { data: Array<{ id: number }> } = await api.get(
        "products/categories",
        { slug }
      );

      if (categoryData.length > 0) {
        const parentId = categoryData[0].id;
        params.parent = parentId;
      } else {
        return NextResponse.json(
          { message: "Category not found for given slug" },
          { status: 404 }
        );
      }
    }

    // Fetch categories using WooCommerce API
    const { data }: { data: unknown } = await api.get("products/categories", params);
    return NextResponse.json(data);

  } catch (error: unknown) {
    // ✅ Strong type guard without using `any`
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: unknown } }).response?.data !== "undefined"
    ) {
      console.error("WooCommerce API error:", (error as { response: { data?: unknown } }).response.data);
    } else if (error instanceof Error) {
      console.error("Error fetching categories:", error.message);
    } else {
      console.error("Unknown error fetching categories:", error);
    }

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
