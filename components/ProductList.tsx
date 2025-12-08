"use client";
import { useCategory } from "@/contexts/category-context";
import { useState } from "react";
import BrandShowCase from "./home/brand-showcase-price";
import ProductCard from "./skeletons/product-card";
import { useProducts } from "@/hooks/wc/useProducts";
import { WooProduct } from "@/types";

export default function ProductList({
  category,
  banner,
  bannerText,
  reverseVertically,
  reverseHorizontally,
  newProduct,
  className
}: {
  category?: number;
  banner: string;
  bannerText: string;
  reverseVertically?: boolean;
  reverseHorizontally?: boolean;
  newProduct?: boolean;
  className?: string;
}) {
   const { data, isLoading, error } = useProducts({
      per_page: 6,
      ...(category ? { category } : {}), //fetch products from a specific caetgory else from all categories
    });

    const products: WooProduct[] = Array.isArray(data)
        ? data
        : (data?.products as WooProduct[]) ?? [];

  if (isLoading) return <ProductCard />;
  if (error) return <p>Error: {error.message}</p>;

  console.log("THIS IS THE WHOLE UI  DATA IN PRODUCTLISTS COMPONENT: ", products, category);

  return (
    <div className={`w-full ${className}`}>
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
