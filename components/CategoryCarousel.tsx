"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { categories } from "../constants/index";

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef<"right" | "left">("right");
  const pausedRef = useRef(false);
  const userInteracting = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 0.07; // 💡 slower: pixels per ms (~4.2px/sec)
    const pauseTime = 2000; // pause at ends (ms)
    let lastFrame = 0;
    let rafId: number;

    const getMaxScroll = () =>
      Math.max(0, container.scrollWidth - container.clientWidth);

    const step = (t: number) => {
      if (!container) return;
      const dt = t - lastFrame;
      lastFrame = t;

      if (!pausedRef.current && !userInteracting.current) {
        const max = getMaxScroll();
        if (directionRef.current === "right") {
          container.scrollLeft += speed * dt;
          if (container.scrollLeft >= max - 1) {
            container.scrollLeft = max;
            pausedRef.current = true;
            setTimeout(() => {
              directionRef.current = "left";
              pausedRef.current = false;
            }, pauseTime);
          }
        } else {
          container.scrollLeft -= speed * dt;
          if (container.scrollLeft <= 1) {
            container.scrollLeft = 0;
            pausedRef.current = true;
            setTimeout(() => {
              directionRef.current = "right";
              pausedRef.current = false;
            }, pauseTime);
          }
        }
      }

      rafId = requestAnimationFrame(step);
    };

    const onUserStart = () => {
      userInteracting.current = true;
      pausedRef.current = true;
    };

    const onUserEnd = () => {
      userInteracting.current = false;
      setTimeout(() => {
        pausedRef.current = false;
      }, 1000);
    };

    container.addEventListener("touchstart", onUserStart, { passive: true });
    container.addEventListener("mousedown", onUserStart);
    container.addEventListener("touchend", onUserEnd);
    container.addEventListener("mouseup", onUserEnd);

    requestAnimationFrame((t) => {
      lastFrame = t;
      rafId = requestAnimationFrame(step);
    });

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("touchstart", onUserStart);
      container.removeEventListener("mousedown", onUserStart);
      container.removeEventListener("touchend", onUserEnd);
      container.removeEventListener("mouseup", onUserEnd);
    };
  }, []);


  const manualScroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = Math.round(container.offsetWidth * 0.6);
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    pausedRef.current = true;
    setTimeout(() => (pausedRef.current = false), 2000);
  };

  return (
    <div className="w-full pl-2 max-w-7xl mx-auto overflow-hidden">
      <h2 className="text-center text-lg md:text-xl font-semibold mb-4">
        Explore our diverse categories
      </h2>

      <div className="relative flex items-center">
        {/* Left Button */}
        <button
          onClick={() => manualScroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <FaChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="category-scroll flex overflow-x-auto gap-4 px-10 py-2 touch-pan-x"
        >
          {[...categories, ...categories].map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[80px] cursor-pointer group select-none"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-purple-300 transition">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-700 mt-2">{cat.name} &gt;</p>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => manualScroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <FaChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <style jsx>{`
        .category-scroll {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 transparent;
          scroll-behavior: smooth;
        }
        .category-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .category-scroll::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          border-radius: 999px;
        }
        .category-scroll::-webkit-scrollbar-button {
          display: none;
        }
      `}</style>
    </div>
  );
}
