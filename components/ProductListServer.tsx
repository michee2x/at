import { fetchWCProducts } from "@/lib/product-service";
import BrandShowCase from "./home/brand-showcase-price";
import { WooProduct } from "@/types";

export default async function ProductListServer({
  category,
  banner,
  bannerText,
  reverseVertically,
  reverseHorizontally,
  newProduct,
  className
}: {
  category?: number;
  banner: string;
  bannerText: string;
  reverseVertically?: boolean;
  reverseHorizontally?: boolean;
  newProduct?: boolean;
  className?: string;
}) {
  try {
    const { products } = await fetchWCProducts({
      per_page: 6,
      category: category ? String(category) : undefined,
    });

    if (!products || products.length === 0) {
      return (
        <div className={`w-full ${className}`}>
          <p className="text-center text-gray-500 py-10">No products available</p>
        </div>
      );
    }

    return (
      <div className={`w-full ${className}`}>
        <div className="w-full min-h-64">
          <BrandShowCase
            product={products}
            banner={banner}
            bannerText={bannerText}
            reverseVertically={reverseVertically}
            reverseHorizontally={reverseHorizontally}
            newProduct={newProduct}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products for list:", error);
    return null;
  }
}
