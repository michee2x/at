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

    let params: Record<string, any> = {
      per_page: perPage,
    };

    // If search is provided, filter categories by name
    if (search) params.search = search;

    // If parent ID is given directly, fetch its subcategories
    if (parent) {
      params.parent = parent;
    }

    // If slug is provided, find its ID first, then fetch its children
    if (slug) {
      const { data: categoryData } = await api.get("products/categories", {
        slug,
      });

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

    // Fetch categories using final parameters
    const { data } = await api.get("products/categories", params);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
