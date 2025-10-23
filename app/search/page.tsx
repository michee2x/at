"use client";

import CategoryFilters from "@/components/CategoryFilters";
import ProductNotFound from "@/components/lottie/ProductNotFound";
import { useSearch } from "@/contexts/search-context";
import useAlgoliaSearch from "@/hooks/useAlgoliaSearch";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";


interface SearchPageProps {
  searchParams: { q?: string };
}

type FilterMap = Record<string, string>;

export default function SearchPage({ searchParams }: SearchPageProps) {
  const [filters, setFilters] = useState<FilterMap>({});
  const query = searchParams.q || "All Products";
  const {setSearch} = useSearch()

  const { products, loading, error, hasSearched } = useAlgoliaSearch(query);

  useEffect(() => {
    setSearch(query)
  }, [query])

  return (
    <main className="flex w-full px-3 mx-auto md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] flex-col font-poppins md:flex-row min-h-screen">
      {/* Sidebar */}
      <CategoryFilters filters={filters} setFilters={setFilters} />

      {/* Main Content */}
      <section className="flex-1 lg:p-6">
        <div className="flex carousel rounded-box w-full flex-nowrap overflow-x-scroll gap-6 pl-10">
          <h1 className="carousel-item">Sort by</h1>
          <h1 className="text-[#6A00EF] carousel-item">Featured</h1>
          <h1 className="carousel-item">Price: Low To High</h1>
          <h1 className="carousel-item">Price: High To Low</h1>
          <h1 className="carousel-item">Average. Customer review</h1>
          <h1 className="carousel-item">Newest Arrival</h1>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 grid grid-cols-2 lg:grid-cols-1 mt-10 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row"
              >
                <div className="w-full sm:w-1/4 flex items-center mb-3 sm:mb-0">
                  <div className="h-40 w-40 bg-gray-200 rounded-lg" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 bg-gray-200 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Only show "no results" if we searched and got nothing */}
        {!loading && hasSearched && products.length === 0 && (
          <p className="w-full h-[100vh] flex flex-col items-center gap-4">
            <ProductNotFound />
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your filters or check back later.
            </p>
          </p>
        )}

        {/* Product List */}
        {!loading && products.length > 0 && (
          <div className="lg:space-y-6 grid grid-cols-2 lg:flex flex-col h-auto w-full mt-10">
            {products.map((p) => (
              <div
                key={p.objectID}
                className="flex border-t-2 gap-3 w-full flex-col lg:flex-row h-auto border-gray-200 py-4"
              >
                <div className="h-40 w-40 lg:h-auto overflow-hidden bg-gray-50 rounded-[5px] sm:w-1/4 flex items-center justify-center mb-3 sm:mb-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center sm:pl-4">
                  <span className="flex text-[10px] lg:text-[12px] gap-2">
                    Sponsored <IoMdInformationCircle className="" />
                  </span>
                  <h2 className="text-[16px] lg:text-lg font-medium text-blue-900 hover:text-blue-600 cursor-pointer">
                    {p.name}
                  </h2>

                  <div className="flex text-[10px] items-center text-yellow-500 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (p.rating || 4)
                            ? "fill-[#6A00EF]"
                            : "fill-gray-300"
                        }
                      />
                    ))}
                    <span className="text-[10px] lg:text-sm text-gray-600 ml-2">
                      {Math.floor(Math.random() * 500)} ratings
                    </span>
                  </div>

                  <div className="mt-2 text-[#6A00EF] text-[14px] lg:text-xl font-semibold">
                    ₦{p.price}{" "}
                    <span className="text-[#565959] text-[12px] lg:text-[14px] font-normal">
                      Save $2,000 (13%)
                    </span>
                  </div>
                  <p className="text-[#565959] text-[12px] mt-1 lg:text-sm">
                    FREE Delivery by {p.store || "Atlaze"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
