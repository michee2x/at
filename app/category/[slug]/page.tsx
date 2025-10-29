"use client";

import React, { useMemo, useState } from "react";
import qs from "query-string";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductCard } from "../page";
import { WooProduct } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/wc/useProducts";
import Filters from "@/components/category/sideFilter";
import { AtlazeBrands } from "@/constants";
import Image from "next/image";

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
              <Link href={p.href} className="hover:text-blue-600 text-[#9747FF]">
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
// Category Page
// -----------------------------
export default function CategoryPageClient({
  initialParams = {},
  categoryMeta = {},
}: {
  initialParams?: Record<string, string | number | undefined>;
  categoryMeta?: any;
}) {
  const [params, setParams] = useState<Record<string, any>>(initialParams);
  const [page, setPage] = useState<number>(Number(initialParams.page) || 1);
  const [perPage, setPerPage] = useState<number>(
    Number(initialParams.per_page) || 24
  );

  const { data, isLoading, isFetching } = useProducts({
    ...params,
    page,
    per_page: perPage,
  });

  const products = Array.isArray(data) ? data : data?.products ?? [];


  function handleFilterChange(patch: Record<string, any>) {
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
    <div className="container w-full mx-auto px-4 lg:px-0 py-8">
      <div className="flex flex-col gap-8">
        <Banner />
        <Breadcrumb />
      </div>
      <div className="flex gap-6 md:gap-10">
        <Filters
          params={params}
          onChange={handleFilterChange}
          availableAttributes={categoryMeta?.attributes || []}
          stores={AtlazeBrands}
        />

        <main className="flex-1">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {categoryMeta?.title ?? "Category"}
            </h1>
            {categoryMeta?.description && (
              <p className="text-gray-600 mt-2">{categoryMeta.description}</p>
            )}
          </header>

          <div className="flex items-center justify-between mb-4">
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

          {isLoading ? (
            <div className="w-full p-6 bg-white rounded-lg mb-4">
              <Loader />
              <div className="text-center text-sm text-gray-500">
                Fetching latest products…
              </div>
            </div>
          ) : products.length > 0 ? (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: WooProduct) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </section>
          ) : !isFetching ? (
            <div className="col-span-full p-6 text-center text-gray-600">
              No products found.
            </div>
          ) : null}

          <footer className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">Page {page}</div>
            <div className="flex gap-2">
              <button
                onClick={() => gotoPage(Math.max(1, page - 1))}
                className="px-3 py-2 border rounded"
              >
                Prev
              </button>
              <button
                onClick={() => gotoPage(page + 1)}
                className="px-3 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}


function Banner(){
  return (
  <div className="w-full relative h-64 hidden lg:block lg:h-[245px] bg-blue-600">
          <div className="absolute z-10 top-[20%] left-[15%] w-[461px] h-[94px] text-[31px]">
            Efficient and Durable Electronics
          </div>
          <Image
            alt="Atlaze category banner"
            src="/banner/Rectangle%2025.png"
            fill
          />
          <div className="w-[336px] h-[228px] absolute top-[10%] right-[16%]">
            <Image
              fill
              alt="atlaze electronics category image"
              src="/banner/Group%203.png"
            />
          </div>
          <div className="w-[328px] left-[15%] items-end bottom-[5%] flex justify-center h-[46px] absolute">
            <div className="w-[107.94px] flex gap-1 items-center h-full">
              <div className="w-[34px] h-[34px] rounded-full bg-[#FF9900]" />
              <h1 className="w-[68px] h-[40px] font-bold text-black">
                TOP BRANDS
              </h1>
            </div>
            <hr className="w-[3px] h-[90%] mr-3 bg-black" />
            <div className="w-[107.94px] flex gap-1 items-center h-full">
              <div className="w-[34px] h-[34px] rounded-full bg-[#FF9900]" />
              <h1 className="w-[68px] h-[40px] font-bold text-black">
                WIDE SELECTION
              </h1>
            </div>
          </div>
        </div>
  );
}