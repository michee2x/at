"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

type TooltipItem = {
  id: number;
  name: string;
  image?: string;
};

type AnimatedTooltipProps = {
  items: TooltipItem[];
};

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  // store requestAnimationFrame id
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  /** MouseMove handler with full typing */
  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const target = event.currentTarget; // typed HTMLImageElement
      const halfWidth = target.offsetWidth / 2;

      // offsetX is available through nativeEvent
      const offsetX = event.nativeEvent.offsetX;

      x.set(offsetX - halfWidth);
    });
  };

  console.log("AnimatedTooltip | rendering with items:", items);

  return (
    <>
      {items.map((item) => (
        <div
          className="group relative -mr-4"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX,
                  rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative border-2 border-black/50 overflow-hidden bg-[#F4EDE1] !m-0 h-14 lg:h-16 w-14 lg:w-16 object-cover rounded-lg object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105">
            <img
              onMouseMove={handleMouseMove}
              height={100}
              width={100}
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </>
  );
};
