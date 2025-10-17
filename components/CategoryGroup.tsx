"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface CategoryImage {
  id?: number;
  src: string;
  alt?: string;
}

interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  image?: string | CategoryImage | null;
  count?: number;
  parent?: number;
}

interface CategoryGroupProps {
  title: string;
  parent: number;
  linkText?: string;
}

export default function CategoryGroup({
  title,
  parent,
  linkText = "Explore",
}: CategoryGroupProps) {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`/api/categories?parent=${parent}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      } finally {
        setLoading(false);
      }
    }

    if (parent) fetchCategories();
  }, [parent]);

  const getImageSrc = (image: CategoryItem["image"]): string => {
    if (!image) return "/placeholder.png";
    if (typeof image === "string") return image;
    if (typeof image === "object" && "src" in image) return image.src;
    return "/placeholder.png";
  };

  return (
    <div className="rounded-2xl w-full shadow-sm lg:shadow-xl p-4 bg-white hover:shadow-2xl transition">
      <h3 className="font-semibold text-[22px] font-poppins md:text-base mb-3">
        {title}
      </h3>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 mb-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-gray-100 rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {items.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex flex-col items-start space-y-1"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                <Image
                  src={getImageSrc(item.image)}
                  alt={item?.name || "Category image"}
                  fill
                  className="object-cover w-full"
                />
              </div>

              <p className="text-xs text-gray-600 leading-tight">
                {item.name.replace("amp;", "")}
              </p>
            </div>
          ))}
        </div>
      )}

      <button className="text-xs flex items-center gap-1 lg:gap-2 font-medium text-[#6A00EF] font-poppins hover:underline">
        {linkText}
        <FaChevronRight className="lg:text-xl mt-1`" />
      </button>
    </div>
  );
}
