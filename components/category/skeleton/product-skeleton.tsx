"use client";

import Image from "next/image";

export function ProductSkeleton() {
  return (
    <div className="border border-gray-300 bg-white rounded-xl p-3 flex flex-col animate-pulse">
      {/* Image placeholder with gray logo */}
      <div className="w-full aspect-square bg-gray-200 mb-3 rounded-lg flex items-center justify-center overflow-hidden relative">
        <Image
          src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
          alt="logo"
          width={48}
          height={48}
          className="object-contain filter grayscale opacity-50"
          unoptimized
        />
      </div>

      {/* Title placeholder */}
      <div className="h-4 bg-gray-200 rounded mb-2"></div>

      {/* Subtitle placeholder */}
      <div className="h-3 bg-gray-100 rounded mb-3 w-3/4"></div>

      {/* Button placeholder */}
      <div className="h-8 bg-gray-200 rounded mt-auto"></div>
    </div>
  );
}
