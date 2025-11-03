"use client";
import { useEffect, useState } from "react";
import { WooProduct } from "@/types"; // 👈 optional but recommended if this hook fetches products

type FilterMap = Record<string, string | number | undefined>;

interface UseFilteredProductsOptions {
  filters?: FilterMap;
  page?: number;
  perPage?: number;
  categoryId?: string;
}

export function useFilteredProducts({
  filters = {},
  page = 1,
  perPage = 12,
  categoryId = "",
}: UseFilteredProductsOptions) {
  //  Use WooProduct[] (or a generic type) instead of any[]
  const [data, setData] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Pagination
        params.append("page", String(page));
        params.append("per_page", String(perPage));
        params.append("category", categoryId);

        // Dynamic filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "" && value !== "All") {
            params.append(key.toLowerCase().replace(/\s+/g, "_"), String(value));
          }
        });

        const url = `/api/products?${params.toString()}`;
        console.log("Fetching products:", url);

        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching products: ${res.status} - ${text}`);
        }

        const result: WooProduct[] = await res.json();

        // If fewer results than per_page → no more pages
        setHasMore(Array.isArray(result) && result.length === perPage);
        setData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Failed to fetch products:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [filters, page, perPage, categoryId]);

  return { data, loading, error, hasMore };
}
