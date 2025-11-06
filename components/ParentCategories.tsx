"use client";

import React from "react";
import VerticalCategory from "./VerticalCategory";
import { useCategory } from "@/contexts/category-context";
import { FaArrowLeftLong } from "react-icons/fa6";

const ParentCategories: React.FC = () => {
  const {queryData} = useCategory()
  const {
    categories, isLoading, isError, error
  } = useCategory()

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
    return (
      <div className="text-center text-gray-400 py-8">
        No parent categories found.
      </div>
    );
  }

  return (
    <div className="h-full max-w-[30%] bg-gray-200">
      <div className="p-4 text-black text-3xl">
        {!queryData.catTitle ? (
          <h1>General Categories</h1>
        ) : (
          <>
            <span className="text-[14px] pb-2 flex items-center gap-3">
              <FaArrowLeftLong className="text-xl cursor-pointer hover:text-blue-600" />
              subcategory for
            </span>
            <h1>{queryData.catTitle}</h1>
          </>
        )}
      </div>
      <VerticalCategory categories={categories} />
    </div>
  );
};

export default ParentCategories;