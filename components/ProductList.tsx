"use client";
import { useCategory } from "@/contexts/category-context";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import BrandShowCase from "./home/brand-showcase-price";
import ProductCard from "./skeletons/product-card";

export default function ProductList({
  category,
  banner,
  bannerText,
  reverseVertically,
  reverseHorizontally,
}: {
  category?: number;
  banner: string;
  bannerText: string;
  reverseVertically?: boolean;
  reverseHorizontally?: boolean;
}) {
  const { products, loading, error } = useProducts({
    category,
  });
  const { categories } = useCategory();

  if (loading) return <ProductCard />;
  if (error) return <p>Error: {error}</p>;

  console.log("THIS IS THE WHOLE UI  DATA: ", products);

  return (
    <div className="space-y-8">
      {/* Category filter */}
      {/* <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              selectedCategory === cat.id
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat.name.replace(/&amp;/g, "&")}
          </button>
        ))}
      </div> */}

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="w-full min-h-64">
          <BrandShowCase
            product={products}
            banner={banner}
            bannerText={bannerText}
            reverseVertically={reverseVertically}
            reverseHorizontally={reverseHorizontally}
          />
        </div>
      ) : (
        <p>No Available product for this category</p>
      )}
    </div>
  );
}
