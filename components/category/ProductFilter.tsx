"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/contexts/filter-context";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { X, Star } from "lucide-react";
import { useState } from "react";
import { SearchParamsType } from "@/app/(root)/categories/page";

interface ProductFilterProps {
  searchParams: SearchParamsType;
  brands?: string[];
  vendors?: Array<{ id: string; name: string }>;
}

export function ProductFilter({
  searchParams,
  brands = [],
  vendors = [],
}: ProductFilterProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { showFilter, setShowFilter } = useFilter();

  // Prevent background scroll when the overlay is open
  useLockBodyScroll(showFilter);

  // Local state for form values
  const [minPrice, setMinPrice] = useState(searchParams.min_price || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.max_price || "");
  const [selectedVendor, setSelectedVendor] = useState(searchParams.vendor || searchParams.store || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.brand || "");
  const [selectedSort, setSelectedSort] = useState(searchParams.orderby || "");
  const [selectedStock, setSelectedStock] = useState(searchParams.stock_status || "");
  const [selectedRating, setSelectedRating] = useState(searchParams.rating || "");
  const [onSale, setOnSale] = useState(searchParams.on_sale === "true");
  const [featured, setFeatured] = useState(searchParams.featured === "true");

  function applyFilters() {
    const query = new URLSearchParams(params.toString());

    // Price range
    if (minPrice) {
      query.set("min_price", minPrice);
    } else {
      query.delete("min_price");
    }
    
    if (maxPrice) {
      query.set("max_price", maxPrice);
    } else {
      query.delete("max_price");
    }

    // Vendor
    if (selectedVendor) {
      query.set("vendor", selectedVendor);
      query.set("store", selectedVendor);
    } else {
      query.delete("vendor");
      query.delete("store");
    }

    // Brand
    if (selectedBrand) {
      query.set("brand", selectedBrand);
    } else {
      query.delete("brand");
    }

    // Sort
    if (selectedSort) {
      query.set("orderby", selectedSort);
    } else {
      query.delete("orderby");
    }

    // Stock status
    if (selectedStock) {
      query.set("stock_status", selectedStock);
    } else {
      query.delete("stock_status");
    }

    // Rating
    if (selectedRating) {
      query.set("rating", selectedRating);
    } else {
      query.delete("rating");
    }

    // On sale
    if (onSale) {
      query.set("on_sale", "true");
    } else {
      query.delete("on_sale");
    }

    // Featured
    if (featured) {
      query.set("featured", "true");
    } else {
      query.delete("featured");
    }

    // Reset to page 1
    query.set("page", "1");

    // Close overlay on mobile after applying
    setShowFilter(false);

    router.push(`?${query.toString()}`);
  }

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setSelectedVendor("");
    setSelectedBrand("");
    setSelectedSort("");
    setSelectedStock("");
    setSelectedRating("");
    setOnSale(false);
    setFeatured(false);

    // Navigate to base URL without filters
    const query = new URLSearchParams();
    if (params.get("category")) {
      query.set("category", params.get("category")!);
    }
    query.set("page", "1");

    setShowFilter(false);
    router.push(`?${query.toString()}`);
  }

  return (
    <>
      {/* Backdrop / Overlay for mobile - 30% at top */}
      <div
        className={`${
          showFilter ? "fixed inset-0 z-40 bg-black/50 lg:hidden" : "hidden"
        }`}
        onClick={() => setShowFilter(false)}
        aria-hidden
      />

      {/* Filter Panel: Bottom sheet on mobile (70% height), sidebar on desktop */}
      <div
        id="filter-sidebar"
        className={`transition-all duration-300 ease-in-out ${
          showFilter
            ? "fixed bottom-0 left-0 right-0 z-50 h-[70vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden lg:hidden"
            : "hidden"
        } lg:block lg:static lg:h-auto lg:overflow-visible`}
      >
        <div className="flex flex-col h-full lg:h-auto">
          {/* Mobile header with close button - Sticky */}
          <div className="lg:hidden sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              type="button"
              onClick={() => setShowFilter(false)}
              aria-label="Close filters"
              className="p-2 hover:bg-[#6a00f3]/10 rounded-full transition text-gray-700 hover:text-[#6a00f3]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:p-0">
            <Card className="h-fit rounded-2xl p-4 space-y-5 border-none lg:border shadow-none lg:shadow-sm">
              {/* Desktop header */}
              <div className="hidden lg:block">
                <h3 className="text-base font-bold mb-4">Filters</h3>
              </div>

              {/* Price Range */}
              <div>
                <label className="block mb-2 text-sm font-medium">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-9"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Vendor Filter */}
              {vendors.length > 0 && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Vendor</label>
                  <Select value={selectedVendor || undefined} onValueChange={(val) => setSelectedVendor(val)}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="All vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Brand</label>
                  <Select value={selectedBrand || undefined} onValueChange={(val) => setSelectedBrand(val)}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Rating Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium">Minimum Rating</label>
                <Select value={selectedRating || undefined} onValueChange={(val) => setSelectedRating(val)}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-1">
                          {rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> & up
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block mb-2 text-sm font-medium">Sort By</label>
                <Select value={selectedSort || undefined} onValueChange={(val) => setSelectedSort(val)}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block mb-2 text-sm font-medium">Stock Status</label>
                <Select value={selectedStock || undefined} onValueChange={(val) => setSelectedStock(val)}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Filters */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium">On Sale</span>
                  <input
                    type="checkbox"
                    checked={onSale}
                    onChange={(e) => setOnSale(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium">Featured Products</span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </Card>
          </div>

          {/* Sticky footer with action buttons - Mobile */}
          <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1 h-10 border-[#6a00f3] text-[#6a00f3] hover:bg-[#6a00f3]/10"
            >
              Clear All
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 h-10 bg-[#6a00f3] hover:bg-[#5a00d3] text-white"
            >
              Apply Filters
            </Button>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden lg:block mt-4 space-y-2">
            <Button
              onClick={applyFilters}
              className="w-full bg-[#6a00f3] hover:bg-[#5a00d3] text-white"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full border-[#6a00f3] text-[#6a00f3] hover:bg-[#6a00f3]/10"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
