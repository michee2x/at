"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import NavBar from "../navbar";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollY, scrollYProgress } = useScroll();
  const [isFloating, setIsFloating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [marginTop, setMarginTop] = useState(true);

  const lastY = useRef(0);
  const lastDirection = useRef(0); // -1 = up, 1 = down

  useMotionValueEvent(scrollY, "change", (currentY) => {
    const prevY = lastY.current;
    const delta = currentY - prevY;
    const scrollPercent = scrollYProgress.get() * 100;

    // Enable floating only after 5% scroll
    if (scrollPercent >= 5) {
      setIsFloating(true);
      setMarginTop(false);

      // Direction detection with threshold to prevent jitter
      const scrollThreshold = 25; // px difference before reacting

      if (Math.abs(delta) > scrollThreshold) {
        if (delta > 0 && lastDirection.current !== 1) {
          // scrolling down
          setVisible(false);
          lastDirection.current = 1;
        } else if (delta < 0 && lastDirection.current !== -1) {
          // scrolling up
          setVisible(true);
          lastDirection.current = -1;
        }
      }
    } else {
      // Reset to normal navbar
      setIsFloating(false);
      setMarginTop(true);
      setVisible(true);
      lastDirection.current = 0;
    }

    lastY.current = currentY;
  });

  // When floating is off (top of page)
  if (!isFloating) {
    return (
      <div className={cn("w-full relative top-0 bg-white z-[8999]", className)}>
        <NavBar showCategories={marginTop} />
      </div>
    );
  }

  // When floating behavior is active
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "flex w-screen sticky top-0 bg-white inset-x-0 mx-auto z-[8999] items-center justify-center shadow-md",
          className
        )}
      >
        <NavBar showCategories={marginTop} />
      </motion.div>
    </AnimatePresence>
  );
};
