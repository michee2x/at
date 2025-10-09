import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_API_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET() {
  try {
    const { data } = await api.get("products/categories", { per_page: 100 });
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching categories:", error.message);
    } else if (typeof error === "object" && error !== null && "response" in error) {
      // This handles WooCommerce API errors that contain response data
      console.error("Error fetching categories:", (error as { response?: { data?: unknown } }).response?.data);
    } else {
      console.error("Unknown error fetching categories:", error);
    }

    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

