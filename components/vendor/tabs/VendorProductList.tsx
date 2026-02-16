"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { type VendorProduct } from "@/lib/actions/vendor/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorProductListProps {
  initialProducts: VendorProduct[];
}

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc";

export function VendorProductList({ initialProducts }: VendorProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (usually by ID or date if available, here we keep original order)
        break;
    }

    return result;
  }, [initialProducts, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-9 h-10 bg-white border-gray-200 focus-visible:ring-violet-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-gray-500 hidden sm:block" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white border-gray-200 focus:ring-violet-500/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Sorting</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No products found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button 
            variant="link" 
            className="mt-2 text-violet-600 h-auto p-0"
            onClick={() => {
              setSearchQuery("");
              setSortBy("default");
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-transparent">
              <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-3">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-50">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
                
                {product.sale_price && product.sale_price !== product.regular_price && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-medium px-2 py-1 rounded-sm uppercase tracking-wide">
                      Sale
                    </span>
                )}
                
                {/* Quick Add Overlay - Optional aesthetic touch */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
                    <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100 shadow-lg font-medium h-9 text-xs uppercase tracking-wide">
                        View Details
                    </Button>
                </div>
              </Link>
              
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium line-clamp-1">
                    {product.categories?.[0]?.name || "Product"}
                </div>
                <Link href={`/product/${product.slug}`} className="block">
                  <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-auto pt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{parseFloat(product.price).toLocaleString()}
                  </span>
                  {product.regular_price && product.price !== product.regular_price && (
                    <span className="text-xs text-gray-400 line-through">
                      ₦{parseFloat(product.regular_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination hint */}
      {filteredProducts.length > 0 && initialProducts.length >= 12 && (
        <div className="flex justify-center pt-8">
            <Button variant="outline" className="min-w-[150px] border-gray-200">Load More</Button>
        </div>
      )}
    </div>
  );
}
