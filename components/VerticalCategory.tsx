"use client";
import { CATEGORIES } from "@/constants";
import { useCategory } from "@/contexts/category-context";
import { cn } from "@/lib/utils";
import { WooCategory } from "@/types";
import Link from "next/link";
import React, { useRef } from "react";
import { MdArrowOutward } from "react-icons/md";

const VerticalCategory = ({categories}:{categories: WooCategory[]}) => {
  const {activeCategory, setActiveCategory} = useCategory()
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (distance: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ top: distance, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const step = ref.current.clientWidth * 0.6; // visible chunk
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        scrollBy(step);
        break;
      case "ArrowLeft":
        e.preventDefault();
        scrollBy(-step);
        break;
      case "Home":
        e.preventDefault();
        ref.current.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        e.preventDefault();
        ref.current.scrollTo({
          left: ref.current.scrollWidth,
          behavior: "smooth",
        });
        break;
    }
  };
  return (
    <div className="relative flex-1 flex flex-col group">

      {/* Scroll container */}
      <div
        ref={ref}
        role="list"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="no-scrollbar h-full flex-1 relative snap-x snap-mandatory overflow-x-auto scrollbar-none touch-pan-x flex flex-col gap-3 py-3 px-2 sm:px-4 lg:px-6 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((c) => {
          return (
            <Link
              onMouseEnter={() => setActiveCategory(c)}
              key={c.id}
              role="listitem"
              href={`/category/?cat=${c.id}&title=${c.name}`}
              className="snap-center w-fit bg-white py-1 px-2 flex-shrink-0 bgwhite/5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 items-center hover:underline focus-visible:ring-indigo-500 flex gap-2"
              aria-label={c.name}
            >
              <span className="text-xs text-wrap items-center justify-center relative flex-wrap p-1 text-center flex size-full  text-black/80 sm:text-sm line-clamp-2">
                {c.name?.toLowerCase()?.replace("amp;", "")}
              </span>
              <MdArrowOutward className="text-black text-xl" />
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        /* small utility to hide default scrollbar while preserving functionality */
        .no-scrollbar::-webkit-scrollbar {
          height: 0px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          height: 0px;
        }
        .no-scrollbar {
          height: calc(4rem + 1.5rem);
        }
      `}</style>
    </div>
  );
};

export default VerticalCategory;
