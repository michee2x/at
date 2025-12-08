"use client";

import React, { useEffect } from "react";
import VerticalCategory from "./VerticalCategory";
import { useCategory } from "@/contexts/category-context";
import Link from "next/link";
import { WooCategory } from "@/types";
import { FaChevronRight } from "react-icons/fa6";
import { useSideBar } from "@/contexts/sidebar-context";

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
      <div className="text-center py-8 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching categories: {(error as Error).message}
      </div>
    );
  }

  if (!categories?.length) {
    return <div className=""></div>;
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
          className="w-full text-[#2B2B2B] capitalize hover:text-[#9747FF] cursor-pointer h-auto flex items-center justify-between"
        >
          <span className="text-[15px] lg:text-[16px]">
            {c.name?.length > 20
              ? `${c.name.slice(0, 20).replace("amp;", "").toLowerCase()}...`
              : c.name.replace("amp;", "").toLowerCase()}
          </span>
          <FaChevronRight className="text-xl" />
        </Link>
      ))}
    </>
  );
};

export default ParentCategories;
