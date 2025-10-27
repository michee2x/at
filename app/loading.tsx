"use client"

export default function Loading() {
  return (
    <div className="w-screen inset-0 h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl text-primary"></span>
    </div>
  );
}