"use client";
import { WooCategory } from "@/types";
import Link from "next/link";
import React, { useRef } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useCategory } from "@/contexts/category-context";

const VerticalCategory = ({ categories }: { categories: WooCategory[] }) => {
  const { activeCategory, setActiveCategory } = useCategory();
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (distance: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ top: distance, behavior: "smooth" });
  };

  return (
    <div className="relative flex-1 min-h-[120vh] flex flex-col">
      {/* Scroll container */}
      <div
        ref={ref}
        role="list"
        tabIndex={0}
        className="custom-scrollbar h-full flex-1 overflow-y-auto flex flex-col gap-3 py-3 px-2 sm:px-4 lg:px-6 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            onMouseEnter={() => setActiveCategory(c)}
            role="listitem"
            href={`/category/?cat=${c.id}&title=${c.name}`}
            className="w-fit bg-white py-1 px-2 hover:bg-white/10 flex items-center gap-2 rounded"
            aria-label={c.name}
          >
            <span className="text-xs sm:text-sm text-black/80 flex-wrap">
              {c.name?.toLowerCase()?.replace("amp;", "")}
            </span>
            <MdArrowOutward className="text-black text-xl" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VerticalCategory;
