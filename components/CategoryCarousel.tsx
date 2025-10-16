// components/CategoryCarousel.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {categories} from "../constants/index"

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = Math.round(scrollRef.current.offsetWidth * 0.6);
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full pl-2 max-w-7xl mx-auto mt-8">
      <h2 className="text-center text-lg md:text-xl font-semibold mb-4">
        Explore our diverse categories
      </h2>

      <div className="relative flex items-center">
        {/* Left Chevron */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <FaChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable area (unique class for scoped scrollbar styles) */}
        <div
          ref={scrollRef}
          className="category-scroll flex overflow-x-auto gap-4 px-10 py-2 scroll-smooth"
        >
          {[...categories, ...categories].map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[80px] cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-purple-300 transition">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority={index < 6} /* small perf hint */
                />
              </div>
              <p className="text-xs text-gray-700 mt-2">{cat.name} &gt;</p>
            </div>
          ))}
        </div>

        {/* Right Chevron */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <FaChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Scoped styles using styled-jsx so nothing leaks globally */}
      <style jsx>{`
        .category-scroll {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 transparent;
        }

        /* WebKit browsers (Chrome, Edge, Safari) */
        .category-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .category-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .category-scroll::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          border-radius: 999px;
          min-height: 18px;
        }

        /* --- REMOVE SCROLLBAR ARROW BUTTONS --- */
        .category-scroll::-webkit-scrollbar-button {
          -webkit-appearance: none !important;
          appearance: none !important;
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: none !important;
          border: none !important;
        }

        /* Explicitly override all possible states (Windows-specific) */
        .category-scroll::-webkit-scrollbar-button:single-button,
        .category-scroll::-webkit-scrollbar-button:start:decrement,
        .category-scroll::-webkit-scrollbar-button:end:increment,
        .category-scroll::-webkit-scrollbar-button:horizontal:decrement,
        .category-scroll::-webkit-scrollbar-button:horizontal:increment,
        .category-scroll::-webkit-scrollbar-button:decrement,
        .category-scroll::-webkit-scrollbar-button:increment {
          -webkit-appearance: none !important;
          appearance: none !important;
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: none !important;
          border: none !important;
        }

        /* Remove scrollbar corner */
        .category-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Slightly slimmer on desktop */
        @media (min-width: 768px) {
          .category-scroll::-webkit-scrollbar {
            height: 4px;
          }
          .category-scroll::-webkit-scrollbar-thumb {
            background-color: #b5b5b5;
          }
        }

        @media (min-width: 1280px) {
          .category-scroll::-webkit-scrollbar-thumb {
            min-height: 14px;
          }
        }
      `}</style>
    </div>
  );
}

