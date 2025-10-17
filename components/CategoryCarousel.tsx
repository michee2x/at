"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { categories } from "../constants/index";

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef<"right" | "left">("right");
  const pausedRef = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 0.4; // px per frame
    const pauseTime = 2000; // ms
    const tolerance = 1;
    let lastTimestamp = 0;

    const waitForImages = async () => {
      const imgs = Array.from(container.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );
    };

    const startAnimation = () => {
      const step = (timestamp: number) => {
        if (!container) return;
        const maxScroll = Math.max(
          0,
          container.scrollWidth - container.clientWidth
        );
        const dt = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        if (!pausedRef.current) {
          if (directionRef.current === "right") {
            container.scrollLeft = Math.min(
              container.scrollLeft + speed * (dt / 16),
              maxScroll
            );
            if (Math.ceil(container.scrollLeft) >= maxScroll - tolerance) {
              pausedRef.current = true;
              container.scrollLeft = maxScroll;
              setTimeout(() => {
                directionRef.current = "left";
                pausedRef.current = false;
              }, pauseTime);
            }
          } else {
            container.scrollLeft = Math.max(
              container.scrollLeft - speed * (dt / 16),
              0
            );
            if (Math.floor(container.scrollLeft) <= tolerance) {
              pausedRef.current = true;
              container.scrollLeft = 0;
              setTimeout(() => {
                directionRef.current = "right";
                pausedRef.current = false;
              }, pauseTime);
            }
          }
        }

        requestAnimationFrame(step);
      };

      requestAnimationFrame((t) => {
        lastTimestamp = t;
        step(t);
      });
    };

    // Wait until all images load before starting
    waitForImages().then(() => startAnimation());
  }, []);

  const manualScroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = Math.round(container.offsetWidth * 0.6);
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    // pause auto-scroll temporarily
    pausedRef.current = true;
    directionRef.current = dir;
    setTimeout(() => (pausedRef.current = false), 2000);
  };

  return (
    <div className="w-full pl-2 max-w-7xl mx-auto mt-8 overflow-hidden">
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
