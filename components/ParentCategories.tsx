"use client";

import React from "react";
import VerticalCategory from "./VerticalCategory";
import { useCategory } from "@/contexts/category-context";

const ParentCategories: React.FC = () => {
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
      <div className="">
        
      </div>
    );
  }

  return (
    <div className="h-fit pt-6 pb-10 w-full bg-gray-200">
      
      <VerticalCategory categories={categories} />
    </div>
  );
};

export default ParentCategories;