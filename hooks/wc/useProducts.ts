import { useQuery, keepPreviousData } from "@tanstack/react-query";
import qs from "query-string";
import { WooProduct } from "@/types";

type ProductsResponse = {
  products: WooProduct[];
  total: number;
  totalPages: number;
};

export function useProducts(params: Record<string, any>) {
  const queryString = qs.stringify(params);

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await fetch(`/api/wc/product?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData, // ✅ retain old data during refetch
  });
}
