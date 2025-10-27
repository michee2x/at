"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LensProps {
  children: React.ReactNode;
  imageUrl: string;
  zoomFactor?: number;
  lensSize?: number;
  gap?: number;
}

export const Lens: React.FC<LensProps> = ({
  children,
  imageUrl,
  zoomFactor = 1.3,
  lensSize = 800,
  gap = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const img = containerRef.current?.querySelector("img") as HTMLImageElement;
    if (img) {
      const updateSize = () =>
        setImageSize({ width: img.width, height: img.height });
      updateSize();
      img.addEventListener("load", updateSize);
      return () => img.removeEventListener("load", updateSize);
    }
  }, []);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

  const posX = clamp(mousePosition.x, 0, imageSize.width);
  const posY = clamp(mousePosition.y, 0, imageSize.height);

  const backgroundPosition = `${(posX / imageSize.width) * 100}% ${
    (posY / imageSize.height) * 100
  }%`;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed w-1/2 h-screen right-0 top-1/2 -translate-y-1/2 border border-gray-300 bg-white overflow-hidden shadow-xl z-[999]"
          >
            <div
              className="absolute inset-0 bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${zoomFactor * 100}%`,
                backgroundPosition,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
