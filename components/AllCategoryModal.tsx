"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaChevronUp } from "react-icons/fa6";
import HorizontalCategory from "./VerticalCategory";
import ParentCategories from "./ParentCategories";
import { useEffect, useState } from "react";
import { WooCategory } from "@/types";
import { useCategory } from "@/contexts/category-context";
import { IoChevronForward } from "react-icons/io5";
import { useParentCategories } from "@/hooks/wc/useCategory";

const CategoryInfo = ({ category }: { category: WooCategory }) => {
  const {
    isLoading,
    data: subCategories,
    isError,
    error,
  } = useParentCategories({ id: `${category.id}` });

  // 🧠 Loading State
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto flex flex-col gap-4 p-4">
        <h1 className="text-xl flex items-center gap-2 text-gray-700">
          {category?.name?.replace("amp;", "")} <IoChevronForward />
        </h1>
        <div className="grid grid-cols-6 gap-3">
          {[...Array(12)].map((_, idx) => (
            <li key={idx} className="w-auto animate-pulse">
              <div className="size-[6rem] rounded-full bg-gray-200"></div>
              <div className="h-[7px] mr-6 mt-4 rounded-full bg-gray-200 w-2/3"></div>
              <div className="h-[7px] mr-6 mt-2 rounded-full bg-gray-200 w-1/2"></div>
            </li>
          ))}
        </div>
      </div>
    );
  }

  // 🧠 Error State
  if (isError) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-red-500">
        <p className="text-sm">⚠️ Failed to load subcategories.</p>
        <p className="text-xs text-gray-500">{error?.message}</p>
      </div>
    );
  }

  // 🧠 Empty / No Subcategory State
  if (!subCategories || subCategories.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-gray-600">
        <h1 className="text-xl flex items-center gap-2">
          {category.name.replace("amp;", "")} <IoChevronForward />
        </h1>
        <div className="text-center text-sm opacity-80">
          No subcategories found for this category.
        </div>
      </div>
    );
  }

  // ✅ Normal UI
  return (
    <div className="flex-1 overflow-auto flex flex-col gap-4 p-4">
      <h1 className="text-xl flex items-center gap-2">
        {category.name.replace("amp;", "")} <IoChevronForward />
      </h1>
      <div className="grid grid-cols-5 gap-3">
        {subCategories.map((sub, id) => (
          <Link
          key={`${id}`}
            href={`/category/?cat=${sub.id}&title=${sub.name}`} // ✅ open subcategory page
            className="w-full flex items-center cursor-pointer flex-col gap-2 h-fit min-h-44 rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 transition"
          >
            {sub.image?.src ? (
              <img
                src={sub.image.src}
                alt={sub.name}
                className="size-[6rem] rounded-full object-cover"
              />
            ) : (
              <div className="size-[6rem] rounded-full text-black/60 bg-gray-200 flex justify-center items-center text-[13px]">
                no image
              </div>
            )}
            <span className="text-xs text-center text-wrap items-center justify-center p-1 text-black/80 sm:text-sm line-clamp-2">
              {sub.name?.length > 20
                ? `${sub.name
                    .slice(0, 20)
                    .toLowerCase()
                    .replace("amp;", "")}...`
                : sub.name.toLowerCase().replace("amp;", "")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CategoryInfoSkeleton = () => {
  return (
  <div className="flex-1 animate-pulse p-8 bg-red-500">
    <h1 className="w-16 h-4 bg-gray-200"></h1>
  </div>
);
};
const AllCategoryModal = () => {
  
  const {activeCategory, setActiveCategory} = useCategory()
  return (
    <Link
      href={"/category"}
      className="text-[(16/1280 * 100vw)] flex-1 h-full leading-[100%] tracking-[0%] font-display"
    >
      <Tooltip>
        <TooltipTrigger className="flex h-[5rem] items-center gap-2">
          All Categories{" "}
          <FaChevronUp className="text-[16px] transform rotate-180" />
        </TooltipTrigger>

        <TooltipContent
          data-fullwidth="true"
          hideArrow
          side="bottom"
          sideOffset={-4}
          className="inset-0 overflow-auto flex justify-center bg-black/50 w-screen h-screen"
        >
          {/* Your white content area */}
          <div className="w-[80%] h-[80%] flex rounded-lg bg-white">
            <ParentCategories />
            <div className="flex-1 flex">
              {activeCategory && Object.keys(activeCategory).length ? <CategoryInfo category={activeCategory} /> : <CategoryInfoSkeleton />}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
};

export default AllCategoryModal;
