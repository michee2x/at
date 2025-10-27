"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { WooProductImage } from "./page";

// Dynamically load zoom component (client-only)
const ProductImageZoom = dynamic(
  () => import("@/components/ProductImageZoom"),
  {
    ssr: false,
  }
);

export default function ProductImageZoomWrapper({
  src,
  alt,
  gallery,
}: {
  src: string;
  alt: string;
  gallery: WooProductImage[];
}) {
  // 👇 Track currently displayed main image
  const [mainImage, setMainImage] = useState(src);

  return (
    <div className="w-full flex items-center justify-center gap-6">
      {/* Main Image */}
      <div className="h-[70vh] aspect-square">
        <ProductImageZoom src={mainImage} alt={alt} />
      </div>

      {/* Thumbnails */}
      <div className="w-1/3 flex flex-col pl-6 gap-2 h-full overflow-y-auto">
        {gallery.length > 1 &&
          gallery.map((item, idx) => (
            <div
              className="relative bg-gray-100 rounded-xl w-[70px] h-[70px] cursor-pointer"
              onMouseEnter={() => setMainImage(item.src ?? "/placeholder.png")}
            >
              <Image
                fill
                src={item.src ?? "/placeholder.png"}
                alt={item.alt ?? `thumbnail-${idx}`}
                className="object-contain pointer-events-none" // <--- important
              />
            </div>
          ))}
      </div>
    </div>
  );
}
