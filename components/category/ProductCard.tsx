"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { WooProduct } from "@/types";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { Ratings } from "../Ratings";
import { ProductDescription } from "./productDesc";

export function ProductCard({ product }: { product: WooProduct }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isHover, setIsHover] = useState(false);

  // Grab first video from meta_data
  const productVideo = product.meta_data?.find((m) =>
    m.key.startsWith("_product_video_url")
  )?.value as string | undefined;

  // Detect if YouTube
  const isYouTube =
    productVideo?.includes("youtube.com") || productVideo?.includes("youtu.be");

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const status = await addItem({
        id: product.id,
        price: product.price,
        quantity: 1,
        name: product.name,
        slug: product.slug,
        images: product.images,
      });

      const updatedCart = useCart.getState().cart;
      const addedItem = updatedCart.items.find((i) => i.id === product.id);
      if (addedItem && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:add", {
            detail: {
              id: addedItem.id,
              slug: addedItem.slug,
              name: addedItem.name,
              price: Number(addedItem.price),
              quantity: addedItem.quantity,
              image: addedItem.images,
              time: Date.now(),
            },
          })
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const rating = parseFloat(product.average_rating ?? "0") || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  // Helper to convert YouTube URL to embed URL with autoplay
  const youtubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    const id = match?.[1];
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1`
      : url;
  };

  return (
    <div
      className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col hover:shadow-lg transition"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* IMAGE + VIDEO */}
      <div className="relative w-full aspect-square mb-3 rounded-t-xl overflow-hidden">
        {/* Static image */}
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isHover && productVideo ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* YouTube Video iframe */}
        {isYouTube && productVideo && (
          <iframe
            src={isHover ? youtubeEmbedUrl(productVideo) : undefined}
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              isHover ? "opacity-100" : "opacity-0"
            }`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={product.name}
          />
        )}

        {/* If productVideo is direct mp4 file */}
        {!isYouTube && productVideo && (
          <video
            src={productVideo}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              isHover ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div className="px-3 w-full h-auto flex flex-col gap-1">
        {/* Product Name & Rating */}
        <h2 className="lg:text-[15px] text-[14px] font-medium text-black mb-1">
          <a href={product.permalink} target="_blank" rel="noopener noreferrer">
            {product.name.length > 22
              ? `${product.name.slice(0, 22)}...`
              : product.name}
          </a>
        </h2>
        <div className="flex items-center gap-1">
          <p className="-ml-2">
            <Ratings rating={product.rating_count} />
          </p>
          <span className="text-[10px] lg:text-[12px] text-black/50">
            ({product.rating_count})
          </span>
        </div>

        {/* Short Description */}
        {product && (
          <ProductDescription
            product={product}
            shorten={true}
            sliceLength={45}
            showTitle={false}
            className="p-0 m-0 lg:p-0 text-[10px] lg:text-[12px] text-black/50"
          />
        )}

        {/* Price & Stock */}
        <div className="flex mt-2 flex-col lg:flex-row justify-between lg:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
                <Image
                  src="/home/hero/Nigeria.png"
                  alt="nigeria logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[12px] lg:text-[14px] text-[#6A00EF]">
                ₦{Number(product.price).toLocaleString()}
              </span>
            </div>
            <span className="flex gap-3 items-center">
              <span className="text-[10px] text-black/50">
                {product.total_sales}+ purchased
              </span>
              <span className="text-[10px] text-green-600">
                {product.stock_status === "instock"
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="lg:mt-5 mt-2 w-[97%] mx-auto text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-1 justify-center flex transition"
      >
        <GoPlus className="text-2xl" />
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
