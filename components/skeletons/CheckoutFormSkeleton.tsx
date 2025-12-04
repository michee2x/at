"use client";

import React from "react";

export default function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6 px-4 animate-pulse">
      <div className="h-6 w-3/4 bg-gray-300 rounded"></div>

      {/* Delivery Method */}
      <div className="flex gap-3">
        <div className="flex-1 h-24 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 h-24 bg-gray-300 rounded-lg"></div>
      </div>

      <hr className="border-gray-200" />

      {/* Name & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="sm:col-span-2 h-10 bg-gray-300 rounded"></div>

        <div className="sm:col-span-2 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>

      {/* Submit Button */}
      <div className="h-12 bg-gray-300 rounded w-full mt-4"></div>
    </div>
  );
}
