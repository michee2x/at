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
}

export function ProductGrid({ initialProducts, totalPages }: ProductGridProps) {
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
      
      {/* Infinite Scroll Loader (Mobile) */}
      {isMobile && hasMore && (
        <div ref={ref} className="w-full py-12 flex justify-center items-center min-h-[100px]">
          {loadingMore && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#6a00f3]" />
              <span className="text-sm text-gray-500">Loading more products...</span>
            </div>
          )}
        </div>
      )}

      {/* End of products message (Mobile) */}
      {isMobile && !hasMore && deduplicatedProducts.length > 0 && (
        <div className="w-full py-8 flex justify-center items-center">
          <span className="text-sm text-gray-500">You&apos;ve reached the end</span>
        </div>
      )}

      {/* Pagination (Desktop) */}
      {!isMobile && totalPages > 1 && (
        <DesktopPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            router.push(`?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}

function DesktopPagination({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;
    
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + showMax - 1);
    
    if (end - start < showMax - 1) {
      start = Math.max(1, end - showMax + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn("h-9 w-9", currentPage === page ? "bg-primary text-white" : "")}
        >
          {page}
        </Button>
      ))}
      
      {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="text-muted-foreground">...</span>
      )}
      
      {totalPages > 5 && currentPage < totalPages - 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-9 w-9"
          >
            {totalPages}
          </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
