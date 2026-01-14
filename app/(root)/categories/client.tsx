"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WooProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Ratings } from "@/components/Ratings";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { QuickLookModal } from "@/components/QuickLookModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function ProductCard({ product }: { product: WooProduct }) {
  const { cart, addItem, updateQuantity, removeItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Track image loading state to show custom loader
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Quick Look Modal State
  const [quickLookOpen, setQuickLookOpen] = useState(false);
  
  // Lazy loading: Only render when card is in viewport
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Check if product is on sale
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  // Optimize performance by not rendering the full card if it's not in the viewport
  if (!inView) {
    return <div ref={ref} className="aspect-[3/4] bg-gray-100 rounded-xl" />;
  }

  return (
    <Card ref={ref} className="group p-0 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#6a00f3]/30 transition-all duration-300 overflow-hidden bg-white relative">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Product Image with Custom Loading State */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 group/image">
          {/* Quick Look Button - Visible on Group Hover */}
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
             <button
                onClick={(e) => {
                    e.preventDefault();
                    setQuickLookOpen(true);
                }}
                className="bg-white hover:bg-gray-50 text-gray-900 transition-all transform hover:scale-105 shadow-sm hover:shadow-md rounded-full px-2.5 py-1 flex items-center gap-1.5 font-medium text-[11px] sm:text-xs border border-gray-200"
                title="Quick Look"
             >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick Look</span>
             </button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {isOnSale && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            {product.stock_status === "outofstock" && (
              <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Custom Loading State: Pulsing Atlaze Logo */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="relative w-16 h-16 animate-pulse">
                <Image
                  src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                  alt="Loading..."
                  fill
                  className="object-contain grayscale opacity-30"
                />
              </div>
            </div>
          )}
          
          {/* Actual Product Image */}
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
              <Image
                src={product.images?.[0]?.src || "/placeholder.png"}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-110`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
          </Link>
        </div>

        {/* Product details */}
        <div className="flex flex-col flex-1 space-y-2.5 p-3">
          <div className="flex-1 space-y-1.5">
            <Link href={`/product/${product.slug}`}>
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 hover:text-[#6a00f3] transition-colors">
                {product.name}
                </h3>
            </Link>
            
            {/* Rating & Sales */}
            <div className="flex items-center justify-between gap-2">
              {product.average_rating && parseFloat(product.average_rating) > 0 ? (
                <div className="flex items-center gap-1">
                  <Ratings rating={parseFloat(product.average_rating)} starSize={13} />
                </div>
              ) : (
                <span className="text-xs text-gray-400">No reviews</span>
              )}
              
              {product.total_sales !== undefined && product.total_sales > 0 && (
                <span className="text-xs text-gray-500 font-medium">
                  {product.total_sales} sold
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                <div className="w-[16px] relative h-[16px] lg:w-[18px] lg:h-[18px]">
                  <Image
                    src="/home/hero/Nigeria.png"
                    alt="₦"
                    fill
                    className="object-cover"
                  />
                </div>
                <span>{Number(product.price).toLocaleString()}</span>
              </div>
              
              {isOnSale && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₦{Number(product.regular_price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Cart Controls */}
          <div className="min-h-[36px] flex items-end pt-1">
              <AddToCartButton 
                product={product} 
                variant="full" 
                className={justAdded ? "scale-105" : ""}
              />
          </div>
        </div>
      </CardContent>

      {/* Quick Look Modal */}
      <QuickLookModal 
        isOpen={quickLookOpen} 
        onClose={() => setQuickLookOpen(false)} 
        product={product} 
      />
    </Card>
  );
}

export function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);

  function goTo(p: number) {
    const query = new URLSearchParams(params.toString());
    query.set("page", p.toString());
    router.push(`?${query.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
      >
        Prev
      </Button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => goTo(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
