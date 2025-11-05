"use client";

import { WooCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseParentCategoriesProps {
  id: string | number;
  cache?: boolean;
}

export const useParentCategories = ({ id, cache = false }: UseParentCategoriesProps) => {
  // Fetcher function
  const fetchCategories = async (): Promise<WooCategory[]> => {
    const res = await fetch(`/api/wc/categories?parent=${id}`, {
      cache: cache ? "force-cache" : "no-store", //respect cache flag
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    return res.json();
  };

  // TanStack Query
  const query = useQuery<WooCategory[]>({
    queryKey: ["parent-categories", id, cache], //include both for cache separation
    queryFn: fetchCategories,
    staleTime: cache ? 1000 * 60 * 5 : 0, //disable staleness if no cache
    gcTime: cache ? 1000 * 60 * 10 : 0, //disable garbage collection if no cache
    refetchOnWindowFocus: !cache, //only refetch on focus when cache is off
    enabled: id !== undefined && id !== null //always allow 0
  });

  return query;
};
