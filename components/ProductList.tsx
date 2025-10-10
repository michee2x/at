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
  newProduct,
}: {
  category?: number;
  banner: string;
  bannerText: string;
  reverseVertically?: boolean;
  reverseHorizontally?: boolean;
  newProduct?: boolean;
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
      {products.length > 0 ? (
        <div className="w-full min-h-64">
          <BrandShowCase
            product={products}
            banner={banner}
            bannerText={bannerText}
            reverseVertically={reverseVertically}
            reverseHorizontally={reverseHorizontally}
            newProduct={newProduct}
          />
        </div>
      ) : (
        <p>No Available product for this category</p>
      )}
    </div>
  );
}
