"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/category/ProductCard";
import { Params, WooProduct } from "@/types";
import { useProducts } from "@/hooks/wc/useProducts";
import Filters from "@/components/category/sideFilter";
import { AtlazeBrands, cleared, productBrand } from "@/constants";
import Image from "next/image";
import { HiAdjustmentsHorizontal, HiOutlineBookmark } from "react-icons/hi2";
import { useFilter } from "@/contexts/filter-context";
import ProductNotFound from "@/components/lottie/ProductNotFound";
import Carousel from "@/components/category/carousel";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Ratings } from "@/components/Ratings";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hoverCard";
import { HoverCardInfo } from "@/components/category/hovercard";
import { ProductDescription } from "@/components/category/productDesc";
import { ProductSkeleton } from "@/components/category/skeleton/product-skeleton";
import { GoArrowUpRight } from "react-icons/go";
import ClearButton from "@/components/buttons/clearButton";
import { isCleared } from "@/utils/isCleared";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import { LiaTimesSolid } from "react-icons/lia";
import CartToastContainer from "@/components/cart/CartToastContainer";

// -----------------------------
// Loader
// -----------------------------
export function Loader({ size = 48 }: { size?: number }) {
  return (
    <div className="grid w-full lg:gap-x-4 gap-2 p-2 bg-zinc-200 lg:bg-inherit grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-h-[100px]">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
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
    <nav
      className="text-[15px] capitalize text-gray-500 mb-3"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="hover:text-[#ab23e0] text-[#cb47ff]">
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

  //Get the search params and store in variables
  const searchParams = useSearchParams();
  const banner = searchParams.get("banner");
  const title = searchParams.get("title");
  const category = searchParams.get("cat");
  const [params, setParams] = useState<Params>(initialParams);
  const [local, setLocal] = useState<Params>({ ...params });
  const [page, setPage] = useState<number>(Number(initialParams.page) || 1);
  const [perPage, setPerPage] = useState<number>(
    Number(initialParams.per_page) || 24
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<WooProduct[]>([]);

  const { data, isLoading, isFetching } = useProducts({
    ...params,
    page,
    per_page: perPage,
    ...(category ? { category } : {}), //fetch products from a specific caetgory else from all categories
  });

  const products: WooProduct[] = Array.isArray(data)
    ? data
    : (data?.products as WooProduct[]) ?? [];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const hasMore = products.length === perPage;

  const setProductsFunc = () => {
    setAllProducts((prev) => {
      if (page === 1) return products;
      const ids = new Set(prev.map((p) => p.id));
      const newItems = products.filter((p) => !ids.has(p.id));
      return [...prev, ...newItems];
    });
  };

  useEffect(() => {
    if (banner) {
      const bannerFilters: Record<string, Params> = {
        "todays-deals": { on_sale: "true" },
        "weekly-deals": { on_sale: "true" },
        "bundle-deals": { product_type: "grouped" },
        "top-brands": { featured: "true" },
        "best-sellers": { sort: "popularity" },
        "new-arrivals": { sort: "latest" },
        "coming-soon": { catalog_visibility: "hidden" },
      };

      setParams((prev) => ({ ...prev, ...bannerFilters[banner] }));
    }
  }, [banner]);

  // Merge/append products
  useEffect(() => {
    if (isLoading || !products) return;
    setProductsFunc();
    // stop showing spinner after new data arrives
    setLoadingMore(false);
  }, [products, isLoading, page]);

  useEffect(() => {
    if (
      !isMobile ||
      !inView ||
      loadingMore ||
      isLoading ||
      isFetching ||
      !hasMore
    )
      return;

    const timer = setTimeout(() => {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [inView, isMobile, hasMore, isLoading, isFetching, loadingMore]);

  // Reset products when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setAllProducts(products);
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
  const ParamsIsEmpty = isCleared(params, cleared) || isCleared(params, {});
  return (
    <div className=" pt-5 w-full mx-auto lg:px- pb-8">
      <CartToastContainer />
      <div className="flex w-full px-4 lg:px-7 2xl:px-12 flex-col gap-8">
        <Carousel />
        {/* <Banner /> */}
        <Breadcrumb />
      </div>
      <div className="flex container mx-auto gap-6 md:gap-10">
        <Filters
          params={params}
          setParams={setParams}
          onChange={handleFilterChange}
          availableAttributes={categoryMeta?.attributes || []}
          stores={AtlazeBrands}
          brands={productBrand}
          local={local}
          setLocal={setLocal}
        />

        <main className="lg:flex-1 w-screen lg:px-2 min-h-[50vh]">
          <header
            id="header"
            className="text-xl lg:text-2xl sticky py-3 lg:relative top-0 bg-white z-20 border-gray-300 lg:border-0 border-b flex items-center pb-2 justify-between lg:p-0 px-4 font-semibold text-gray-900 lg:mb-6"
          >
            <h1 className="lg:text-3xl text-[16px] font-bold">
              {title ?? "Category"}
            </h1>
            {categoryMeta?.description && (
              <p className="text-gray-600 mt-2">{categoryMeta.description}</p>
            )}
            <HiAdjustmentsHorizontal
              onClick={() => setShowFilter(true)}
              className="text-2xl lg:hidden text-gray-700"
            />
          </header>

          <div className="flex items-center px-2 justify-between my-4">
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

          <div className="w-full">
            {isLoading ? (
              <div className="w-full lg:p-6 bg-white rounded-lg mb-4">
                <Loader />
              </div>
            ) : allProducts.length > 0 ? (
              <section className="grid grid-cols-2 lg:gap-4 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {allProducts.map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </section>
            ) : !isFetching && allProducts.length === 0 && !ParamsIsEmpty ? (
              <div className="col-span-full flex h-[40vh] flex-col items-center justify-center text-center pb-16 text-gray-600">
                <ProductNotFound />
                <p className="text-lg font-semibold">No products found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters or check back later...
                </p>
                {params && (
                  <ClearButton
                    className="mt-4 px-5  w-fit py-2lg:py-3 lg:px-7 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                    setLocal={setLocal}
                    setParams={setParams}
                    onChange={handleFilterChange}
                  />
                )}
              </div>
            ) : !isFetching && allProducts.length === 0 && ParamsIsEmpty ? (
              <div className="col-span-full flex h-[40vh] flex-col items-center justify-center text-center pb-16 text-gray-600">
                <ProductNotFound />
                <p className="text-lg font-semibold">
                  No products under this category
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try checking back later...
                </p>
                {params && (
                  <Button
                    className="mt-4 px-5  w-fit py-2lg:py-3 lg:px-7 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                    asChild
                  >
                    <a href="/category">Reset to all categories</a>
                  </Button>
                )}
              </div>
            ) : null}
          </div>

          <footer className="mt-6 flex flex-col items-center justify-between">
            {/* <div className="text-sm hidden lg:flex text-gray-500">
                Page {page}
              </div> */}
            <button
              onClick={() => gotoPage(page + 1)}
              disabled={!hasMore}
              className={`px-6 hidden ${
                perPage * page > allProducts.length ? "border-0" : ""
              } mt-16 lg:flex py-2 w-[60vw] items-center justify-center mx-auto cursor-pointer border rounded disabled:border-gray-300 disabled:text-gray-400`}
            >
              {perPage * page > allProducts.length ? (
                <span className="loading text-[#6A00EF] loading-spinner loading-xl"></span>
              ) : (
                "load more"
              )}
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
