"use client";

import React, { useEffect } from "react";
import { useCategory } from "@/contexts/category-context";
import Link from "next/link";
import { WooCategory } from "@/types";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  openPopupWithDelay: (category: WooCategory) => void;
  closePopupWithDelay: () => void;
};

const ParentCategories = ({
  openPopupWithDelay,
  closePopupWithDelay,
}: Props) => {
  const { categories, isLoading, isError, error } = useCategory();

  useEffect(() => {
    if (categories) {
      openPopupWithDelay(categories[0]);
    }
  }, [categories]);

  if (isLoading) {
    return (
      <div className="space-y-1">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4 text-sm">
        Error loading categories
      </div>
    );
  }

  if (!categories?.length) {
    return <div className="text-center text-gray-400 py-4 text-sm">No categories</div>;
  }

  return (
    <>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/categories/?cat=${c.id}&title=${c.name}`}
          onMouseEnter={() => openPopupWithDelay(c)}
          onMouseLeave={closePopupWithDelay}
        >
          <Button
            variant="ghost"
            className="w-full justify-between h-10 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors group"
          >
            <span className="text-sm font-medium capitalize truncate">
              {c.name?.replace("amp;", "").toLowerCase()}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
          </Button>
        </Link>
      ))}
    </>
  );
};

export default ParentCategories;
