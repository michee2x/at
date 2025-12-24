import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_API_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  image?: { src: string } | string | null;
  count?: number;
  parent?: number;
}

export async function fetchCategoriesByParent(parentId: number): Promise<CategoryItem[]> {
  try {
    const { data } = await api.get("products/categories", {
      parent: parentId,
      per_page: 4, // Match the UI grid (4 items)
    });
    return data as CategoryItem[];
  } catch (error) {
    console.error(`Error fetching categories for parent ${parentId}:`, error);
    return [];
  }
}
