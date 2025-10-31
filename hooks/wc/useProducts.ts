import { useQuery, keepPreviousData } from "@tanstack/react-query";
import qs from "query-string";
import { WooProduct, Params } from "@/types"; // ✅ You already have Params in your types

type ProductsResponse = {
  products: WooProduct[];
  total: number;
  totalPages: number;
};

// ✅ Use your already-defined Params type instead of Record<string, any>
export function useProducts(params: Params) {
  const queryString = qs.stringify(params);

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async (): Promise<ProductsResponse> => {
      const res = await fetch(`/api/wc/product?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
