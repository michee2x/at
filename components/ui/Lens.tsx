"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import Image from "next/image";

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
  zoomFactor = 1.6,
  lensSize = 800,
  gap = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  const percentX = posX / imageSize.width;
  const percentY = posY / imageSize.height;

  const translateX = -(percentX * (zoomFactor - 1) * 100);
  const translateY = -(percentY * (zoomFactor - 1) * 100);

  const zoomBox = (
    <AnimatePresence>
      {isHovering && (
        <motion.div
          key="zoom-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed hidden inset-0 lg:flex items-center justify-end pointer-events-none"
          style={{
            zIndex: 999999, // above everything
          }}
        >
          <div className="relative w-1/2 h-screen bg-white overflow-hidden shadow-2xl border border-gray-300 pointer-events-auto">
            <Image
              src={imageUrl}
              alt="zoomed"
              fill
              priority
              draggable={false}
              className="object-contain will-change-transform transition-transform duration-75 ease-linear"
              style={{
                transform: `scale(${zoomFactor}) translate(${
                  translateX / zoomFactor
                }%, ${translateY / zoomFactor}%)`,
                transformOrigin: "top left",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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

      {/* Render zoom box in portal to avoid stacking issues */}
      {mounted && createPortal(zoomBox, document.body)}
    </>
  );
};
