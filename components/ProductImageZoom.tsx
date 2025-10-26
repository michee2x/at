"use client";

import React from "react";
import Image from "next/image";
import { Lens } from "@/components/ui/Lens"; // adjust to your actual path

interface ProductImageZoomProps {
  src: string;
  alt: string;
}

export default function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  return (
    <div className="relative h-full w-full max-w-md mx-auto">
      <Lens zoomFactor={1.8} lensSize={200}>
        <img
          src={src}
          alt={alt}
          className="rounded-lg object-contain w-full h-full"
        />
      </Lens>
    </div>
  );
}
