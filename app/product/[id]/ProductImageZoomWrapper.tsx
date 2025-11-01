"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { WooProductImage } from "@/types";

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
    <div className="w-full h-auto flex flex-col lg:flex-row-reverse items-center justify-center gap-6">
      {/* Main Image */}
      <div className="lg:h-[70vh] h-[50vh] flex justify-center w-full bg-[#FAFAFA] cursor-zoom-in rounded-lg border border-[#dbdbdb] aspect-square">
        <ProductImageZoom src={mainImage} alt={alt} />
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
         <div className="lg:w-1/3 carousel rounded-box w-full flex lg:flex-col pl-6 gap-2 lg:h-full h-auto overflow-y-auto">
          {gallery.map((item, idx) => (
            <div
              key={`${idx}`}
              className="relative carousel-item bg-gray-100 rounded-xl w-[70px] h-[70px] cursor-pointer"
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
      )}
    </div>
  );
}
