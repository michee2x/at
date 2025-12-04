"use client";

import React from "react";

const OrderCardSkeleton = () => {
  return (
    <div className="lg:w-full w-full lg:p-3 h-[228.32px] animate-pulse">
      <div className="w-full flex flex-col gap-2">
        <div className="flex-1 flex items-center">
          {/* Placeholder for line items / images */}
          <div className="flex gap-2">
            <div className="h-14 w-14 rounded-full bg-gray-300" />
            <div className="h-14 w-14 rounded-full bg-gray-300" />
            <div className="h-14 w-14 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* Placeholder for status */}
        <div className="mt-2 h-6 w-28 rounded-full bg-gray-300" />
      </div>

      {/* Order Key / Delivery Code */}
      <div className="mt-4">
        <div className="h-5 w-32 rounded bg-gray-300 mb-1" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>

      {/* Total amount / Delivery address labels */}
      <div className="w-full mt-5 h-auto flex justify-between">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>

      {/* Total amount / Delivery address values */}
      <div className="w-full mt-2 h-auto flex justify-between">
        <div className="h-5 w-20 rounded bg-gray-300" />
        <div className="h-5 w-36 rounded bg-gray-300" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
