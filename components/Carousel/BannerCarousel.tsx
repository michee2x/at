"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

export type SlideItem = {
  id: string;
  content: ReactNode;
};

export interface BannerCarouselProps {
  slides: SlideItem[];
  interval?: number;
  className?: string;
}

export default function BannerCarousel({
  slides,
  interval = 5000,
  className,
}: BannerCarouselProps) {
  const count = slides.length;
  const [index, setIndex] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Clone slides for infinite loop
  const extendedSlides = useMemo(() => {
    if (count <= 1) return slides;
    return [slides[count - 1], ...slides, slides[0]];
  }, [slides, count]);

  const total = extendedSlides.length;

  const goTo = useCallback((to: number) => {
    setIndex(to);
    setIsTransitioning(true);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Reset to real slide after transition (infinite loop)
  useEffect(() => {
    if (count <= 1) return;

    if (index === total - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(1);
      }, 350);
      return () => clearTimeout(timer);
    }
    if (index === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(total - 2);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [index, total, count]);

  // Autoplay
  useEffect(() => {
    if (interval <= 0 || count <= 1 || isPaused) return;

    let rafId: number;
    let last = performance.now();
    let elapsed = 0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const delta = now - last;
      last = now;
      elapsed += delta;

      if (elapsed >= interval) {
        elapsed = 0;
        next();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [interval, count, next, isPaused]);

  // Touch/Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (count === 0) return null;

  const transitionClass = isTransitioning
    ? "transition-transform duration-[350ms] ease-out"
    : "";

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none", className)}
      aria-roledescription="carousel"
      aria-label="Promotional banners"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track Container */}
      <div className="overflow-hidden h-full w-full">
        <div
          ref={trackRef}
          className={cn("flex h-full", transitionClass)}
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
          onTransitionEnd={() => {
            if (!isTransitioning) setIsTransitioning(true);
          }}
        >
          {extendedSlides.map((slide, i) => (
            <div
              key={`${slide.id}-${i}`}
              className="w-full flex-shrink-0"
              style={{ minWidth: "100%" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: Prev, Pause/Play, Next */}
      {count > 1 && (
        <div className="absolute bottom-2 right-4 flex gap-2 items-center bg-black/45 backdrop-blur-sm rounded-full p-1 lg:p-2 text-white">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="p-2 hover:bg-white/20 hidden lg:flex rounded-full transition-colors"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Play carousel" : "Pause carousel"}
            className="px-3 py-1 text-sm hover:bg-white/20 rounded-full transition-colors"
          >
            {isPaused ? "▶" : "❚❚"}
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="p-2 hover:bg-white/20 hidden lg:flex rounded-full transition-colors"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dots Indicator */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => {
            const isActive =
              index === i + 1 ||
              (index === 0 && i === count - 1) ||
              (index === total - 1 && i === 0);

            return (
              <button
                key={i}
                onClick={() => goTo(i + 1)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isActive ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
