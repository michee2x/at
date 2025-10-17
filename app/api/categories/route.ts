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

    // ✅ Use const + properly typed params
    const params: Record<string, string | number> = {
      per_page: Number(perPage),
    };

    if (search) params.search = search;
    if (parent) params.parent = parent;

    // ✅ If slug is provided, get its ID and fetch its children
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

    // ✅ Final category fetch
    const { data }: { data: unknown } = await api.get("products/categories", params);

    return NextResponse.json(data);
  } catch (error) {
    // ✅ Stronger type-safe error logging
    if (typeof error === "object" && error && "response" in error) {
      console.error("WooCommerce API error:", (error as any).response?.data);
    } else {
      console.error("Error fetching categories:", (error as Error).message);
    }

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
