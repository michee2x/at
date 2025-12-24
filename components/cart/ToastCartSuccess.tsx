"use client";

import Image from "next/image";
import { WooProduct } from "@/types";
import { Check } from "lucide-react";

interface ToastCartSuccessProps {
  product: WooProduct;
  quantity: number;
}

export function ToastCartSuccess({ product, quantity }: ToastCartSuccessProps) {
  return (
    <div className="flex gap-3 items-center min-w-[280px]">
      {/* Image */}
      <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
           <span className="flex items-center gap-1 text-green-600 font-medium">
             <Check className="w-3 h-3" /> Added to cart
           </span>
           <span>•</span>
           <span>Qty: {quantity}</span>
        </div>
      </div>
      
       {/* Price */}
       <div className="text-sm font-bold text-[#6a00f3] whitespace-nowrap">
          ₦{Number(product.price).toLocaleString()}
       </div>
    </div>
  );
}
