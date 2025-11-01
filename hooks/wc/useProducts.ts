import { useQuery, keepPreviousData } from "@tanstack/react-query";
import qs from "query-string";
import { WooProduct } from "@/types";

// ✅ Define the expected response type
type ProductsResponse = {
  products: WooProduct[];
  total: number;
  totalPages: number;
};

// ✅ Define the shape of your query params more safely
// Allows only string, number, or boolean (query-string supports these)
type QueryParams = Record<string, string | number | boolean | undefined>;

export function useProducts(params: QueryParams) {
  const queryString = qs.stringify(params);

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async (): Promise<ProductsResponse> => {
      const res = await fetch(`/api/wc/product?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<ProductsResponse>;
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
