"use client";

import React from "react";
import { Lens } from "@/components/ui/Lens"; // adjust to your actual path
import Image from "next/image";

export default function ProductImageZoom({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Lens imageUrl={src}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
        draggable={false}
      />
    </Lens>
  );
}
