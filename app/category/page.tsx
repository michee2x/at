"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductCard } from "@/components/category/ProductCard";
import { Params, WooProduct } from "@/types";
import { useProducts } from "@/hooks/wc/useProducts";
import Filters from "@/components/category/sideFilter";
import { AtlazeBrands, productBrand } from "@/constants";
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
import ProductImageZoomWrapper from "@/app/product/[id]/ProductImageZoomWrapper";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hoverCard";
import { HoverCardInfo } from "@/components/category/hovercard";
import { ProductDescription } from "@/components/category/productDesc";
import { ProductSkeleton } from "@/components/category/skeleton/product-skeleton";
import { GoArrowUpRight } from "react-icons/go";
import { FaTimes } from "react-icons/fa";
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
  const [clickedProduct, setClickedProduct] = useState<WooProduct | null>(null);
  const [params, setParams] = useState<Params>(initialParams);
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
    <div className="container w-full mx-auto lg:px- pb-8">
      <Drawer>
        <div className="flex w-full px-4 flex-col gap-8">
          <Carousel />
          {/* <Banner /> */}
          <Breadcrumb />
        </div>
        <div className="flex gap-6 md:gap-10">
          <Filters
            params={params}
            setParams={setParams}
            onChange={handleFilterChange}
            availableAttributes={categoryMeta?.attributes || []}
            stores={AtlazeBrands}
            brands={productBrand}
          />

          <main className="lg:flex-1 w-screen px-2 min-h-[20vh">
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

            <div className="w-full">
              {isLoading ? (
                <div className="w-full lg:p-6 bg-white rounded-lg mb-4">
                  <Loader />
                </div>
              ) : allProducts.length > 0 ? (
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {allProducts.map((p) => (
                    <DrawerTrigger
                      key={p.id}
                      onClick={() => setClickedProduct(p)}
                    >
                      <ProductCard product={p} />
                    </DrawerTrigger>
                  ))}
                </section>
              ) : !isFetching ? (
                <div className="col-span-full flex h-[40vh] flex-col items-center justify-center text-center pb-16 text-gray-600">
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

        <DrawerContent className="h-[90vh]">
          <DrawerClose className="text-3xl cursor-pointer text-white fixed right-6 -top-10">
            <FaTimes />
          </DrawerClose>
          <div className="flex-1 overflow-auto pt-4 pb-10 h-full lg:gap-10 flex flex-col lg:flex-row px-6 lg:px-16">
            <div className="flex-1">
              {clickedProduct && (
                <ProductImageZoomWrapper
                  src={clickedProduct.images[0].src}
                  alt={
                    clickedProduct.images[0].alt ??
                    `${clickedProduct.name} image`
                  }
                  gallery={clickedProduct.images.slice(0, 6)}
                />
              )}
            </div>
            {clickedProduct && (
              <div className="flex-1 lg:p-6">
                <header className="font-poppins mt-10 lg:mt-0">
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1 lg:gap-2">
                      <Link
                        href={`/product/${clickedProduct.id}`}
                        className="text-[26px] hover:underline hover:cursor-pointer flex flex-wrap items-center gap-2 lg:text-3xl font-bold"
                        itemProp="name"
                      >
                        {clickedProduct.name}
                        <GoArrowUpRight className="inline-block" />
                      </Link>
                      <p
                        className="text-[15px] hover:cursor-pointer hover:underline font-poppins text-[#7E7E7E]"
                        aria-hidden
                      >
                        {/* Keep semantic category info if available; fallback */}
                        {clickedProduct?.categories[0]?.name
                          ?.replace("&amp;", "")
                          ?.toLowerCase()}
                      </p>
                    </div>
                    <p
                      className="lg:text-[20px] text-[18px] flex items-center justify-between text-[#111111] font-semibold"
                      itemProp="offers"
                      itemScope
                      itemType="http://schema.org/Offer"
                    >
                      <p className="flex gap-1">
                        <span className="font-medium text-[14px]">NGN</span>
                        {clickedProduct.price}
                      </p>
                      <p className="flex flex-row mt-1 flex-nowrap items-start text-[14px] lg:gap-0.5">
                        {clickedProduct.rating_count || "2.5"}
                        <Ratings rating={clickedProduct.rating_count || 2.5} />
                      </p>
                    </p>
                  </div>
                  <div className="my-6 flex flex-row gap-6 lg:items-center w-full">
                    <Avatar className="rounded-full size-[5rem]">
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback className="size-[5rem] bg-blue-600 text-white rounded-full">
                        ER
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 flex flex-col lg:flex-row justify-between">
                      <HoverCard>
                        <HoverCardTrigger className="cursor-pointer hover:underline">
                          Evilrabbit
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-black text-white">
                          <HoverCardInfo />
                        </HoverCardContent>
                      </HoverCard>
                      <div className="flex gap-3 items-center">
                        <div className="tooltip" data-tip="follow @evilrabbit">
                          <button className="btn bg-gray-200 border-0 text-black shadow-none rounded-full">
                            Follow
                          </button>
                        </div>
                        <button className="btn w-fit text-[12px] lg:text-[14px] font-medium px-4 bg-[#660fcf] text-white shadow-sm rounded-full btn-circle border-gray-300">
                          Add to Cart
                        </button>
                        <button className="btn shadow-sm rounded-full btn-circle bg-inherit text-black border-gray-300">
                          <HiOutlineBookmark className="size-[1.2em] font-semibold" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <ProductDescription shorten product={clickedProduct} />
                </header>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
