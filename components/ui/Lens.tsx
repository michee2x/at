"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  gap?: number; // optional gap between image and zoom box
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 6,
  lensSize = 800,
  gap = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomBoxPosition, setZoomBoxPosition] = useState({ left: 0, top: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // get bounding box and image size
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const img = containerRef.current.querySelector("img") as HTMLImageElement;
      if (img) {
        setImageSize({ width: img.width, height: img.height });
      }
      setZoomBoxPosition({
        left: rect.right + gap,
        top: rect.top,
      });
    }
  }, [gap]);

  // prevent background from over-shifting at edges
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

  const backgroundPosX = (() => {
    const maxX = imageSize.width;
    const x = clamp(mousePosition.x, 0, maxX);
    const percentX = (x / maxX) * 100;
    return `${percentX}%`;
  })();

  const backgroundPosY = (() => {
    const maxY = imageSize.height;
    const y = clamp(mousePosition.y, 0, maxY);
    const percentY = (y / maxY) * 100;
    return `${percentY}%`;
  })();

  return (
    <>
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-lg border"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {/* Zoomed Box */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed w-1/2 z-50 h-screen right-0 -translate-y-1/2 top-1/2 border overflow-hidden shadow-xl bg-white"
            style={{
              zIndex: 999,
            }}
          >
            <div
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  (
                    containerRef.current?.querySelector(
                      "img"
                    ) as HTMLImageElement
                  )?.src
                })`,
                backgroundSize: `${zoomFactor * 100}%`,
                backgroundPosition: `${backgroundPosX} ${backgroundPosY}`,
              }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
