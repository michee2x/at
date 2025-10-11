"use client";
import { useCategory } from "@/contexts/category-context";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import BrandShowCase from "./home/brand-showcase";

export default function CategoryList({
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
    <div className={`w-full ${className}`}>
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
