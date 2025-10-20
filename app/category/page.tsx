"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import Link from "next/link";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useFilter } from "@/contexts/filter-context";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import CategoryFilters from "@/components/CategoryFilters";
import ProductNotFound from "@/components/lottie/ProductNotFound";
import { FaStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { WooProduct } from "@/types";


const skeletonArray = Array.from({ length: 8 });
type FilterMap = Record<string, string>;

export default function CategoryPage() {
  const [filters, setFilters] = useState<FilterMap>({});
  const { data: products, loading } = useFilteredProducts(filters);
  const { setShowFilter } = useFilter();

  // ✅ Check if there are active filters
  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(
        (value) => value && value.trim() !== "" && value !== "All"
      ),
    [filters]
  );

  // ✅ Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="h-auto w-full md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] font-poppins bg-white">
      {/* Banner */}
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
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 px-6 py-4">
        <Link href="/" className="text-purple-600 hover:underline">
          Home
        </Link>{" "}
        / <span className="text-gray-800 font-medium">Electronics</span>
      </nav>

      <div className="lg:px-6 2xl:px-10">
        <div className="text-2xl border-gray-300 lg:border-0 border-b flex items-center pb-2 justify-between lg:p-0 px-4 font-semibold text-gray-900 lg:mb-6">
          <h1>Electronics</h1>
          <HiAdjustmentsHorizontal
            onClick={() => setShowFilter(true)}
            className="text-2xl lg:hidden text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Sidebar */}
          <CategoryFilters filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          <section className="lg:col-span-5">
            <div className="grid lg:gap-x-4 gap-2 p-2 bg-zinc-100 lg:bg-inherit grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-h-[100px]">
              {loading ? (
                skeletonArray.map((_, i) => <ProductSkeleton key={i} />)
              ) : products.length === 0 ? (
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
                  {/* Optional Clear Filters above products */}
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
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: WooProduct }) {
  return (
    <div className="border border-gray-200 font-poppins bg-white rounded-xl flex flex-col">
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="px-3 w-full h-auto">
        <h2 className="lg:text-[15px] text-[14px] flex flex-col lg:flex-row justify-between font-medium text-black mb-1">
          {`${product.name.slice(0, 15)}...`}
          <span className="flex items-center">
            {[...Array(5)].map((_, idx) => {
              return (
                <FaStar
                key={`${idx}`}
                  className="text-[8px] text-[#FFD700] lg:text-[10px]"
                  id={`${idx}`}
                />
              );
            })}
          </span>
        </h2>
        <div className="lg:text-[12px] text-[10px] text-black/50">
          Elica 60 cm 1200 m3/hr Filterless Autocl...
        </div>
        <div className="flex mt-3 lg:mt-6 flex-col lg:flex-row justify-between lg:items-center">
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
            <span className="text-[10px] text-black/50">300+ purchased</span>
          </div>
          <button className="lg:mt-auto mt-2 w-full lg:w-[110px] text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 items-center gap-1 justify-center flex transition">
            <GoPlus className="text-2xl" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="border border-gray-300 bg-white rounded-xl p-3 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-200 mb-3 rounded-lg"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-100 rounded mb-3 w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded mt-auto"></div>
    </div>
  );
}
