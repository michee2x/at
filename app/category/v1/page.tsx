"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useFilter } from "@/contexts/filter-context";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import CategoryFilters from "@/components/CategoryFilters";
import ProductNotFound from "@/components/lottie/ProductNotFound";
import { FaStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useInView } from "react-intersection-observer";
import { WooProduct } from "@/types";
import { Ratings } from "@/components/Ratings";
import { ProductSkeleton } from "@/components/category/skeleton/product-skeleton";

const skeletonArray = Array.from({ length: 8 });
type FilterMap = Record<string, string>;

export default function CategoryPage({searchParams}: {searchParams: {[key: string]: string}}) {
  const categoryId = searchParams.cat;
  const [filters, setFilters] = useState<FilterMap>({});
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<WooProduct[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: products,
    loading,
    hasMore,
  } = useFilteredProducts({
    filters,
    page,
    perPage: 12,
    categoryId,
  });

  const { setShowFilter } = useFilter();

  // ✅ React intersection observer
  const { ref: loaderRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: false,
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;


  // Reset products when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [JSON.stringify(filters)]);

  // Merge/append products
  useEffect(() => {
    if (loading || !products) return;

    setAllProducts((prev) => {
      if (page === 1) return products;
      const ids = new Set(prev.map((p) => p.id));
      const newItems = products.filter((p) => !ids.has(p.id));
      return [...prev, ...newItems];
    });

    // stop showing spinner after new data arrives
    setLoadingMore(false);
  }, [products, loading, page]);

  // ✅ Load next page when loader enters view (only on mobile)
  useEffect(() => {
    if (!isMobile) return;
    if (inView && hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [inView, isMobile, hasMore, loading, loadingMore]);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some((v) => v && v.trim() !== "" && v !== "All"),
    [filters]
  );

  const clearFilters = () => {
    setFilters({});
    setPage(1);
    setAllProducts([]);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setPage((prev) => prev + 1);
  };

  return (
    <div className="h-auto w-full mx-auto md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] font-poppins bg-white">

      <div className="lg:px-6 2xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Sidebar */}
          <CategoryFilters filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          <section className="lg:col-span-5 pb-6">
            <div className="grid lg:gap-x-4 gap-2 p-2 bg-zinc-100 lg:bg-inherit grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-h-[100px]">
              {loading && page === 1 ? (
                skeletonArray.map((_, i) => <ProductSkeleton key={i} />)
              ) : allProducts.length === 0 ? (
                <div className="col-span-full flex h-[60vh] flex-col items-center justify-center text-center pb-16 text-gray-600">
                  <ProductNotFound />
                  <p className="text-lg font-semibold">No products found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your filters or check back later.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-5 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {hasActiveFilters && (
                    <div className="col-span-full flex justify-end mb-2">
                      <button
                        onClick={clearFilters}
                        className="text-sm px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                  {allProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </>
              )}
            </div>

            {/* Desktop Load More */}
            <button
              onClick={handleLoadMore}
              className="hidden lg:flex w-[50%] border cursor-pointer hover:text-black hover:border-black/70 h-[44px] border-[#d1d1d1] text-[15px] rounded-[10px] text-[#767676] items-center justify-center mx-auto mt-32"
              disabled={!hasMore || loadingMore}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>

            <div
              ref={loaderRef}
              className="lg:hidden flex justify-center mt-10"
            >
              {hasMore && (
                <span className="loading text-[#6A00EF] loading-spinner loading-xl"></span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Subcomponents ---------------------------- */

export function ProductCard({ product }: { product: WooProduct }) {
  return (
    <div className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col">
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover index-10"
        />
      </div>
      <div className="px-3 w-full overflow-hidden h-auto">
        <div className="lg:text-[15px] text-[14px] flex flex-col font-medium text-black mb-1">
          <h2 className="text-start">{`${product.name.slice(0, 15)}...`}</h2>
          <span className="flex justify-start -ml-2">
            <Ratings rating={3.2} />
          </span>
        </div>
        <div className="flex mt-3 flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
                <Image
                  src="/home/hero/Nigeria.png"
                  className="object-cover"
                  alt="nigeria logo"
                  fill
                />
              </div>
              <span className="text-[12px] lg:text-[14px] text-[#6A00EF]">
                {`${product.price.slice(0, 10)}...`}
              </span>
            </div>
            <span className="text-[10px] w-full flex text-black/50">
              300+ purchased
            </span>
          </div>
          <button className="lg:mt-5 mt-2 w-full text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 items-center gap-1 justify-center flex transition">
            <GoPlus className="text-2xl" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
