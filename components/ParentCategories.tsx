"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

import VerticalCategory from "./VerticalCategory";
import { useCategory } from "@/contexts/category-context";
import { WooCategory } from "@/types";

type Props = {
  openPopupWithDelay: (category: WooCategory) => void;
  closePopupWithDelay: () => void;
};

const ParentCategories = ({
  openPopupWithDelay,
  closePopupWithDelay,
}: Props) => {
  const router = useRouter();
  const { categories, isLoading, isError, error } = useCategory();

  /**
   * Redirect back if categories is empty when finished loading.
   * Must be done using useEffect — safe for production.
   */
  useEffect(() => {
    if (!isLoading && !categories?.length) {
      router.back();
    }
  }, [isLoading, categories, router]);

  /**
   * When categories load successfully, automatically open popup
   */
  useEffect(() => {
    if (categories?.length) {
      openPopupWithDelay(categories[0]);
    }
  }, [categories, openPopupWithDelay]);

  // === Loading State ===
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading categories...
      </div>
    );
  }

  // === Error State ===
  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching categories: {(error as Error).message}
      </div>
    );
  }

  // === While redirecting back (avoid UI flash) ===
  if (!categories?.length) {
    return null;
  }

  return (
    <>
      {categories.map((c) => (
        <Link
          key={c.id}
          role="listitem"
          href={`/category/?cat=${c.id}&title=${c.name}`}
          onMouseEnter={() => openPopupWithDelay(c)}
          onMouseLeave={closePopupWithDelay}
          className="w-full text-[#2B2B2B] hover:text-[#9747FF] cursor-pointer h-auto flex items-center justify-between"
        >
          <span className="text-[15px] lg:text-[16px]">
            {c.name?.length > 20
              ? `${c.name.slice(0, 20).replace("amp;", "").toUpperCase()}...`
              : c.name.replace("amp;", "").toUpperCase()}
          </span>
          <FaChevronRight className="text-xl" />
        </Link>
      ))}
    </>
  );
};

export default ParentCategories;
