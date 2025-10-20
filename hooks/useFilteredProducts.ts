"use client";
import { useEffect, useState } from "react";

type FilterMap = Record<string, string>;

export function useFilteredProducts(filters: FilterMap) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // ✅ Build dynamic query params
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== "All") {
            // convert spaces to plus for cleaner WooCommerce reads
            params.append(key.toLowerCase().replace(/ /g, "_"), value);
          }
        });

        // ✅ Fallbacks for pagination or defaults
        if (!params.has("per_page")) params.append("per_page", "12");

        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Error fetching products: ${res.status}`);

        const result = await res.json();
        setData(result);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [filters]);

  return { data, loading };
}
