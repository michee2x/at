"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ NEW
import { GoPlus } from "react-icons/go";
import { WooProduct } from "@/types";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { Ratings } from "../Ratings";
import { Heart } from "lucide-react";

export function ProductCard({ product }: { product: WooProduct }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  const productVideo = product.meta_data?.find((m) =>
    m.key.startsWith("_product_video_url")
  )?.value as string | undefined;

  const isYouTube =
    productVideo?.includes("youtube.com") || productVideo?.includes("youtu.be");

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

    const handleAddToCart = async (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (isAdding) return;
      setIsAdding(true);
      try {
        await addItem({
          id: product.id,
          price: product.price,
          quantity: 1,
          name: product.name,
          slug: product.slug,
          images: product.images,
        });

        // Restore the window event so other UI (popups, toasts, listeners) react
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

  const rating = parseFloat(product.average_rating ?? "0") || 3.5;

  const youtubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    const id = match?.[1];
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1`
      : url;
  };

  const desc =
    product.short_description ||
    product.description ||
    "No description available";

  return (
    <>
      {/* WRAP THE WHOLE CARD IN A LINK */}
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={`/product/${product.slug}`}
        className="block" // ensures click area stays correct
      >
        <div
          className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col transition"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* IMAGE + VIDEO */}
          <div className="relative w-full aspect-square mb-3 rounded-t-xl overflow-hidden">
            {/* FAVORITE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ❌ prevent navigation
                e.preventDefault();
              }}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full 
               bg-white/80 backdrop-blur-xl shadow-md 
               hover:bg-white transition"
            >
              <Heart className="w-4 h-4 text-blue-500" />
            </button>

            {/* Static image */}
            <Image
              src={product.images?.[0]?.src || "/placeholder.png"}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                isHover && productVideo ? "opacity-0" : "opacity-100"
              } ${isHover ? "scale-[1.06]" : "scale-100"}`}
            />

            {/* YouTube video */}
            {isYouTube && productVideo && (
              <iframe
                src={isHover ? youtubeEmbedUrl(productVideo) : undefined}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ${
                  isHover ? "opacity-100 scale-[1.06]" : "opacity-0 scale-100"
                }`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={product.name}
              />
            )}

            {/* MP4 video */}
            {!isYouTube && productVideo && (
              <video
                src={productVideo}
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 pointer-events-none ${
                  isHover ? "opacity-100 scale-[1.06]" : "opacity-0 scale-100"
                }`}
              />
            )}
          </div>

          {/* TEXT DETAILS */}
          <div className="px-3 w-full h-auto flex flex-col">
            <h2 className="lg:text-[14px] text-[13px] font-medium text-black">
              {product.name.length > 22
                ? `${product.name.slice(0, 22)}...`
                : product.name}
            </h2>

            <div className="flex items-center gap-1">
              <Ratings rating={rating} />
            </div>

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

          {/* ADD TO CART BUTTON (NOT PART OF LINK) */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="lg:mt-5 mt-2 w-[97%] mx-auto text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-1 justify-center flex transition"
          >
            <GoPlus className="text-2xl" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* FLOATING DESCRIPTION TOOLTIP */}
      {isHover && (
        <div
          className="fixed z-[9999] lg:flex hidden pointer-events-none max-w-xs bg-white/75 backdrop-blur-3xl shadow-xl border border-gray-200 rounded-lg p-3 text-[12px] leading-[1.3] text-black/80 animate-fade"
          style={{
            top: cursorPos.y,
            left: cursorPos.x,
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: desc.slice(0, 200) + (desc.length > 200 ? "..." : ""),
            }}
          />
        </div>
      )}
    </>
  );
}

export default ProductCard;
