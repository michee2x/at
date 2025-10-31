"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductCard } from "../page";
import { Params, WooProduct } from "@/types";
import { useProducts } from "@/hooks/wc/useProducts";
import Filters from "@/components/category/sideFilter";
import { AtlazeBrands, productBrand } from "@/constants";
import Image from "next/image";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useFilter } from "@/contexts/filter-context";
import ProductNotFound from "@/components/lottie/ProductNotFound";
import BannerCarousel from "@/components/Carousel/BannerCarousel";
import Carousel from "@/components/category/carousel";
import { useInView } from "react-intersection-observer";

// -----------------------------
// Loader
// -----------------------------
export function Loader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-6">
      <svg
        className="animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}

// -----------------------------
// Breadcrumb
// -----------------------------
export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formatName = (str: string) =>
    decodeURIComponent(
      str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );

  const paths = segments.map((seg, i) => ({
    name: formatName(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="text-[15px] text-gray-500 mb-3" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="hover:text-blue-600 text-[#9747FF]">
            Home
          </Link>
        </li>
        {paths.map((p, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span>/</span>
            {idx === paths.length - 1 ? (
              <span className="text-gray-800 font-medium">{p.name}</span>
            ) : (
              <Link
                href={p.href}
                className="hover:text-blue-600 text-[#9747FF]"
              >
                {p.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// -----------------------------
// Types
// -----------------------------
interface CategoryMeta {
  title?: string;
  description?: string;
  attributes?: { name: string; options: string[] }[];
}

// -----------------------------
// Category Page
// -----------------------------
export default function CategoryPageClient({
  initialParams = {},
  categoryMeta = {},
}: {
  initialParams?: Params;
  categoryMeta?: CategoryMeta;
}) {
  const { setShowFilter } = useFilter();
  const { ref: loaderRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: false,
  });
  const [params, setParams] = useState<Params>(initialParams);
  const [page, setPage] = useState<number>(Number(initialParams.page) || 1);
  const [perPage, setPerPage] = useState<number>(
    Number(initialParams.per_page) || 24
  );
  const [productData, setProductData] = useState<WooProduct[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<WooProduct[]>([]);




  const { data, isLoading, isFetching } = useProducts({
    ...params,
    page,
    per_page: perPage,
  });

  const products: WooProduct[] = Array.isArray(data)
    ? data
    : (data?.products as WooProduct[]) ?? [];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const hasMore = products.length === perPage;

  // Merge/append products
  useEffect(() => {
    if (isLoading || !products) return;

    setAllProducts((prev) => {
      if (page === 1) return products;
      const ids = new Set(prev.map((p) => p.id));
      const newItems = products.filter((p) => !ids.has(p.id));
      return [...prev, ...newItems];
    });

    // stop showing spinner after new data arrives
    setLoadingMore(false);
  }, [products, isLoading, page]);


  useEffect(() => {
    if (!isMobile) return;
    if (inView && hasMore && !isLoading && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [inView, isMobile, hasMore, isLoading, loadingMore]);

    // Reset products when filters change
    useEffect(() => {
      setPage(1);
      setAllProducts([]);
    }, [JSON.stringify(params)]);

  function handleFilterChange(
    patch: Params & { _reset?: boolean; _apply?: boolean }
  ) {
    if (patch._reset) {
      setParams({});
      return;
    }
    if (patch._apply) {
      return;
    }
    setParams((prev) => ({ ...prev, ...patch }));
  }

  function gotoPage(n: number) {
    setPage(n);
  }

  return (
    <div className="container bg-gray-50 w-full mx-auto lg:px- pb-8">
      <div className="flex w-full px-4 flex-col gap-8">
        <Carousel />
        {/* <Banner /> */}
        <Breadcrumb />
      </div>
      <div className="flex gap-6 md:gap-10">
        <Filters
          params={params}
          onChange={handleFilterChange}
          availableAttributes={categoryMeta?.attributes || []}
          stores={AtlazeBrands}
          brands={productBrand}
        />

        <main className="lg:flex-1 w-screen px-2 min-h-screen">
          <header
            id="header"
            className="text-xl lg:text-2xl sticky py-3 lg:relative top-0 bg-white z-20 border-gray-300 lg:border-0 border-b flex items-center pb-2 justify-between lg:p-0 px-4 font-semibold text-gray-900 lg:mb-6"
          >
            <h1 className="text-3xl font-bold">
              {categoryMeta?.title ?? "Category"}
            </h1>
            {categoryMeta?.description && (
              <p className="text-gray-600 mt-2">{categoryMeta.description}</p>
            )}
            <HiAdjustmentsHorizontal
              onClick={() => setShowFilter(true)}
              className="text-2xl lg:hidden text-gray-700"
            />
          </header>

          <div className="flex items-center justify-between my-4">
            <div className="text-sm text-gray-500">
              {!isLoading && !isFetching && `${products.length} items`}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {[12, 24, 36, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-h-screen w-full">
            {isLoading ? (
              <div className="w-full p-6 bg-white rounded-lg mb-4">
                <Loader />
              </div>
            ) : allProducts.length > 0 ? (
              <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {allProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </section>
            ) : !isFetching ? (
              <div className="col-span-full flex h-[60vh] flex-col items-center justify-center text-center pb-16 text-gray-600">
                <ProductNotFound />
                <p className="text-lg font-semibold">No products found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters or check back later.
                </p>
                {params && (
                  <button
                    onClick={() => setParams({})}
                    className="mt-4 px-5 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <footer className="mt-6 flex items-center justify-between">
            <div className="text-sm hidden lg:flex text-gray-500">
              Page {page}
            </div>
            <button
              onClick={() => gotoPage(page + 1)}
              disabled={!hasMore}
              className="px-6 hidden lg:flex py-2 cursor-pointer border rounded disabled:border-gray-300 disabled:text-gray-400"
            >
              {perPage * page > allProducts.length
                ? "Loading...."
                : "load more"}
            </button>
            <div
              ref={loaderRef}
              className="lg:hidden flex justify-center mt-10"
            >
              {hasMore && (
                <span className="loading text-[#6A00EF] loading-spinner loading-xl"></span>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

