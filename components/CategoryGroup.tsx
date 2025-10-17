"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  count?: number;
  parent?: number;
}

interface CategoryGroupProps {
  title: string;
  parent: number; // now we accept parent for fetching
  linkText?: string;
}

export default function CategoryGroup({
  title,
  parent,
  linkText = "Explore >",
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
        setItems(data || []);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      } finally {
        setLoading(false);
      }
    }

    if(parent) fetchCategories();
  }, [parent]);

  return (
    <div className="rounded-2xl w-full shadow-sm lg:shadow-md p-4 bg-white hover:shadow-md transition">
      <h3 className="font-semibold text-[22px] font-poppins md:text-base mb-3">
        {title}
      </h3>

      {/* Loading state */}
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
              key={`${item.id}${idx}`}
              className="flex flex-col items-start space-y-1"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                {item.image && (
                  <Image
                    src={
                      item?.image &&
                      typeof item.image === "object" &&
                      "src" in item.image
                        ? item.image.src
                        : "/placeholder.png"
                    }
                    alt={item?.name || "Category image"}
                    fill
                    className="object-cover w-full"
                  />
                )}
              </div>

              <p className="text-xs text-gray-600 leading-tight">{item.name.replace("amp;", "")}</p>
            </div>
          ))}
        </div>
      )}

      <button className="text-xs font-medium text-purple-600 hover:underline">
        {linkText}
      </button>
    </div>
  );
}
