"use client"
export function ProductSkeleton() {
  return (
    <div className="border border-gray-300 bg-white rounded-xl p-3 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-200 mb-3 rounded-lg"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-100 rounded mb-3 w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded mt-auto"></div>
    </div>
  );
}
