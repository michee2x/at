"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WooProduct } from "@/types";
import ProductMediaGallery from "./ProductMediaGallery";
import { Ratings } from "./Ratings"; // Assuming this exists based on client.tsx usage
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type QuickLookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: WooProduct;
};

export function QuickLookModal({ isOpen, onClose, product }: QuickLookModalProps) {
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[80vw] lg:max-w-[85vw] w-full min-h-[90vh] sm:min-h-[80vh] overflow-y-auto sm:overflow-visible p-0 gap-0 rounded-xl bg-white">
        <div className="flex flex-col lg:grid lg:grid-cols-3 h-full">
            
          {/* Left: Gallery (Takes 2/3 on desktop) */}
          <div className="p-4 lg:col-span-2 bg-gray-50 flex items-center justify-center min-h-[300px] h-full">
             <div className="w-full h-full flex items-center justify-center">
                <ProductMediaGallery product={product} className="!w-full h-full" />
             </div>
          </div>

          {/* Right: Details (Takes 1/3 on desktop) */}
          <div className="p-6 lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-full">
            
            {/* Header: Title & Price */}
            <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                        {product.name}
                    </h2>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 text-sm">
                    {product.average_rating && parseFloat(product.average_rating) > 0 ? (
                        <div className="flex items-center gap-1">
                            <Ratings rating={parseFloat(product.average_rating)} starSize={16} />
                            <span className="text-gray-500">({product.rating_count} reviews)</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-gray-400">
                             <Star className="w-4 h-4 mr-1" /> No reviews yet
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold text-[#6a00f3]">
                        <span>₦{Number(product.price).toLocaleString()}</span>
                    </div>
                    {isOnSale && (
                        <div className="flex items-center gap-2">
                             <span className="text-lg text-gray-400 line-through">
                                ₦{Number(product.regular_price).toLocaleString()}
                            </span>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">
                                -{discountPercentage}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            <hr className="border-gray-100" />

            {/* Description */}
            <div className="prose prose-sm text-gray-600 max-w-none line-clamp-6">
                <div dangerouslySetInnerHTML={{ __html: product.short_description || product.description || "No description available." }} />
            </div>

            <div className="flex-1" /> {/* Spacer */}

            {/* Actions */}
            <div className="pt-4 mt-auto">
                 <AddToCartButton 
                    product={product}
                    variant="full"
                    className="h-12 text-base font-semibold shadow-lg shadow-purple-500/20"
                 />
                <div className="mt-4 text-center">
                    <a href={`/product/${product.slug}`} className="text-sm text-gray-500 hover:text-[#6a00f3] underline underline-offset-4">
                        View Full Details
                    </a>
                </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
