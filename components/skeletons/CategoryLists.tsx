"use client";
import { useCategory } from "@/contexts/category-context";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import BrandShowCase from "../home/brand-showcase";
import ProductCard from "./product-card";

export default function CategoList({
  category,
  banner,
  bannerText,
  reverseVertically,
  reverseHorizontally,
  newProduct,
  className,
}: {
  category?: number;
  banner: string;
  bannerText: string;
  reverseVertically?: boolean;
  reverseHorizontally?: boolean;
  newProduct?: boolean;
  className?: string;
}) {
  const { categories } = useCategory();

  console.log("THIS IS THE WHOLE UI  DATA: ", categories);

  return (
    <div className={`space-y-8 ${className}`}>
      {categories.length > 0 ? (
        <div className="w-full min-h-64">
          <BrandShowCase
            categories={categories}
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
