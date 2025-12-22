"use client";

import { useParentCategories } from "@/hooks/wc/useCategory";
import { WooCategory } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const CategoryInfo = ({ category }: { category: WooCategory }) => {
  const {
    isLoading,
    data: subCategories,
    isError,
    error,
  } = useParentCategories({ id: `${category.id}` });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {category?.name?.replace("amp;", "")}
          </h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-red-500">⚠️ Failed to load subcategories.</p>
        <p className="text-xs text-gray-500 mt-1">{error?.message}</p>
      </div>
    );
  }

  // Empty / No Subcategory State
  if (!subCategories || subCategories.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {category.name.replace("amp;", "")}
          </h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No subcategories found
        </div>
      </div>
    );
  }

  // Normal UI
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {category.name.replace("amp;", "")}
        </h2>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {subCategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/?cat=${sub.id}&title=${sub.name}`}
          >
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-gray-200 p-0">
              <div className="aspect-square relative bg-gray-100">
                {sub.image?.src ? (
                  <Image
                    src={sub.image.src}
                    alt={sub.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="size-full bg-gray-200 flex justify-center items-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 capitalize line-clamp-2 leading-tight">
                  {sub.name.replace("amp;", "").toLowerCase()}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryInfo;
