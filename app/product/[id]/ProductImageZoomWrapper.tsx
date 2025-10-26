"use client";

import dynamic from "next/dynamic";

// Load the Lens (or ProductImageZoom) dynamically — client only
const ProductImageZoom = dynamic(
  () => import("@/components/ProductImageZoom"),
  {
    ssr: false,
  }
);

export default function ProductImageZoomWrapper({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <ProductImageZoom src={src} alt={alt} />
  );
}
