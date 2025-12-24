"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchX, Filter, RotateCcw, Loader2 } from "lucide-react";
import { SearchParamsType } from "./page";
import { useState, useEffect } from "react";

interface EmptyFilterStateProps {
  searchParams: SearchParamsType;
}

export function EmptyFilterState({ searchParams }: EmptyFilterStateProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isClearing, setIsClearing] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);

  useEffect(() => {
    setIsClearing(false);
    setIsBrowsing(false);
  }, [params]);

  // Check if any filters are active
  const hasActiveFilters = 
    searchParams.min_price ||
    searchParams.max_price ||
    searchParams.vendor ||
    searchParams.store ||
    searchParams.brand ||
    searchParams.rating ||
    searchParams.on_sale ||
    searchParams.featured ||
    searchParams.stock_status ||
    (searchParams.orderby && searchParams.orderby !== "popularity");

  function clearAllFilters() {
    setIsClearing(true);
    const query = new URLSearchParams();
    if (params.get("category")) {
      query.set("category", params.get("category")!);
    }
    query.set("page", "1");
    router.push(`?${query.toString()}`);
  }

  function handleBrowseAll() {
    setIsBrowsing(true);
    router.push("/");
  }

  return (
    <div className="px-4">
      <Card className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center rounded-2xl border-gray-300 border-2 border-dashed">
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gray-200/10 rounded-full blur-2xl" />
          <div className="relative bg-gray-200 p-6 rounded-full">
            <SearchX className="h-16 w-16 text-gray-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md space-y-3 mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            {hasActiveFilters ? "No Products Match Your Filters" : "No Products Found"}
          </h3>
          
          {hasActiveFilters ? (
            <div className="space-y-2">
              <p className="text-muted-foreground text-base">
                We couldn&apos;t find any products matching your current filter criteria.
              </p>
              
              {/* Active Filters Summary */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {searchParams.min_price && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    Min: ₦{searchParams.min_price}
                  </span>
                )}
                {searchParams.max_price && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    Max: ₦{searchParams.max_price}
                  </span>
                )}
                {searchParams.rating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    {searchParams.rating}+ Stars
                  </span>
                )}
                {searchParams.on_sale === "true" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    On Sale
                  </span>
                )}
                {searchParams.featured === "true" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    Featured
                  </span>
                )}
                {searchParams.stock_status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6a00f3]/10 text-[#6a00f3] rounded-full text-sm font-medium">
                    <Filter className="h-3 w-3" />
                    {searchParams.stock_status === "instock" ? "In Stock" : "Out of Stock"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-base">
              There are currently no products available in this category.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              disabled={isClearing}
              size="lg"
              className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              {isClearing ? "Clearing..." : "Clear All Filters"}
            </Button>
          )}
          
          <Button
            variant={hasActiveFilters ? "outline" : "default"}
            size="lg"
            onClick={handleBrowseAll}
            disabled={isBrowsing}
            className={hasActiveFilters ? "border-gray-900 text-gray-900 hover:bg-gray-800 hover:text-white" : "bg-gray-900 hover:bg-gray-800 hover:text-white text-white"}
          >
             {isBrowsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Browse All Products
          </Button>
        </div>

        {/* Suggestions */}
        {hasActiveFilters && (
          <div className="mt-8 pt-6 border-t max-w-md">
            <p className="text-sm text-muted-foreground mb-3 font-medium">
              Try adjusting your filters:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-[#6a00f3] mt-0.5">•</span>
                <span>Expand your price range</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6a00f3] mt-0.5">•</span>
                <span>Lower the minimum rating requirement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6a00f3] mt-0.5">•</span>
                <span>Remove specific vendor or brand filters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6a00f3] mt-0.5">•</span>
                <span>Clear all filters and start fresh</span>
              </li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
