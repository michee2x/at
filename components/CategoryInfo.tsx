"use client";

import { useParentCategories } from "@/hooks/wc/useCategory";
import { WooCategory } from "@/types";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

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
      <div className="flex-1 overflow-auto flex flex-col gap-4 p-4">
        <h1 className="text-xl flex items-center gap-2 text-gray-700">
          {category?.name?.replace("amp;", "")} <IoChevronForward />
        </h1>
        <div className="flex justify-center flex-wrap list-none gap-3">
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

  // Error State
  if (isError) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-red-500">
        <p className="text-sm">⚠️ Failed to load subcategories.</p>
        <p className="text-xs text-gray-500">{error?.message}</p>
      </div>
    );
  }

  // Empty / No Subcategory State
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

  // Normal UI
  return (
    <div className="flex-1 lg:min-w-1/2 overflow-auto flex flex-col gap-4 p-4">
      <h1 className="text-xl flex items-center gap-2">
        {category ? category.name.replace("amp;", "") : "no name"}{" "}
        <IoChevronForward />
      </h1>
      <div className="flex flex-wrap jus flex-1 gap-3">
        {subCategories.map((sub, id) => (
          <Link
            key={`${id}`}
            href={`/category/?cat=${sub.id}&title=${sub.name}`} // open subcategory page
            className="size-[6rem] aspect-square py-2 flex items-center cursor-pointer flex-col gap-2 h-fit min-h-40 rounded-lg hover:bg-gray-50 transition"
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

export default CategoryInfo;
