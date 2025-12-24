"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { WooProduct } from "@/types";
import { ProductCard } from "./client"; 
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  initialProducts: WooProduct[];
  totalPages: number;
  productsPerPage?: number;
}

export function ProductGrid({ initialProducts, totalPages, productsPerPage = 12 }: ProductGridProps) {
  const [products, setProducts] = useState<WooProduct[]>(initialProducts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nextPage, setNextPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState(true);
  
  // Use ref to track if we're currently loading to prevent race conditions
  const isLoadingRef = useRef(false);
  const loadedPagesRef = useRef(new Set<number>([1])); // Track loaded pages
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "400px", // Start loading earlier for smoother experience
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const searchParamsString = searchParams.toString();

  // Reset everything when filters/search params change
  useEffect(() => {
    setProducts(initialProducts);
    setNextPage(currentPage + 1);
    setHasMore(currentPage < totalPages);
    loadedPagesRef.current = new Set([currentPage]);
    isLoadingRef.current = false;
  }, [searchParamsString, initialProducts, currentPage, totalPages]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Deduplicate products by ID
  const deduplicatedProducts = useMemo(() => {
    const seen = new Set<number>();
    return products.filter(product => {
      if (seen.has(product.id)) {
        return false;
      }
      seen.add(product.id);
      return true;
    });
  }, [products]);

  // Infinite Scroll with proper race condition handling
  const loadMoreProducts = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current || !hasMore || loadingMore) {
      return;
    }
    
    // Check if we've already loaded this page
    if (loadedPagesRef.current.has(nextPage)) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoadingMore(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());
      params.set("per_page", productsPerPage.toString());
      
      const res = await fetch(`/api/wc/product?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more products");
      
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        // Mark this page as loaded
        loadedPagesRef.current.add(nextPage);
        
        // Add new products
        setProducts(prev => [...prev, ...data.products]);
        setNextPage(prev => prev + 1);
        
        // Check if we've reached the end
        if (nextPage >= data.totalPages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [hasMore, loadingMore, nextPage, searchParams]);

  // Trigger load when in view (mobile only)
  useEffect(() => {
    if (inView && isMobile && hasMore && !loadingMore) {
      loadMoreProducts();
    }
  }, [inView, isMobile, hasMore, loadingMore, loadMoreProducts]);

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {deduplicatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Load More Button - Unified for all screen sizes */}
      {hasMore && (
        <div className="w-full py-12 flex justify-center items-center">
          <Button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            variant="outline"
            className="group relative px-8 py-6 h-auto text-base font-medium bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm hover:shadow-md transition-all duration-300 min-w-[240px] rounded-full"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-gray-600">Loading products...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Load More Products
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && deduplicatedProducts.length > 0 && (
        <div className="w-full py-12 flex flex-col items-center gap-3">
          <div className="h-px w-24 bg-gray-200" />
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">End of Results</span>
        </div>
      )}
    </div>
  );
}
