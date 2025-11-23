import React from "react";

export default function CartItemSkeleton() {
  return (
    <div className="w-full flex gap-4 p-4 rounded-lg border animate-pulse">
      {/* Image Skeleton */}
      <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>

      {/* Right Section */}
      <div className="flex flex-col justify-between w-full">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

        {/* Price */}
        <div className="h-3 bg-gray-300 rounded w-1/3 mb-4"></div>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between">
          {/* Quantity buttons */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-6 h-4 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>

          {/* Remove button */}
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
