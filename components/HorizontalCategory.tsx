"use client";
import { CATEGORIES } from "@/constants";
import React, { useRef } from "react";

function CategoryIcon({ emoji }: { emoji?: string }) {
  return (
    <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center text-lg shadow-sm">
      <span aria-hidden>{emoji ?? "📦"}</span>
    </div>
  );
}

const HorizontalCategory = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (distance: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: distance, behavior: "smooth" });
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
    <div className="relative group">
      {/* Left/Right buttons */}
      <button
        aria-label="Scroll categories left"
        onClick={() => scrollBy(-300)}
        className="hidden group-hover:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        aria-label="Scroll categories right"
        onClick={() => scrollBy(300)}
        className="hidden group-hover:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        role="list"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="no-scrollbar snap-x snap-mandatory overflow-x-auto scrollbar-none touch-pan-x flex gap-3 py-3 px-2 sm:px-4 lg:px-6 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map((c) => (
          <a
            key={c.id}
            role="listitem"
            href={`/category/${c.slug}`}
            className="snap-center bg-gray-200 flex-shrink-0 sm:w-36 md:w-[3] lg:w-44 xl:w-48 2xl:w-56 bgwhite/5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-lg py-3 flex flex-col items-center gap-2 text-center transition-shadow shadow-sm"
            aria-label={c.name}
          >
            <CategoryIcon emoji={c.emoji} />
            <span className="text-xs text-black/80 sm:text-sm md:text-base line-clamp-2">
              {c.name}
            </span>
          </a>
        ))}
      </div>

      {/* A small helper for mobile to indicate scroll */}
      <div className="mt-2 text-xs text-gray-400 hidden sm:block">
        Scroll horizontally to see more categories →
      </div>

      <style jsx>{`
        /* small utility to hide default scrollbar while preserving functionality */
        .no-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: black;
          border-radius: 9999px;
        }
        .no-scrollbar {
          scrollbar-color: black transparent;
        }
      `}</style>
    </div>
  );
};

export default HorizontalCategory;
