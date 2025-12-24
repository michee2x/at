"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WooProduct } from "@/types";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

interface AddedToCartToastProps {
  product: WooProduct;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AddedToCartToast({ product, quantity, isOpen, onClose }: AddedToCartToastProps) {
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    setMounted(true);
    // Auto close after 4 seconds
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] pointer-events-none flex justify-center items-start pt-4 sm:pt-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto bg-white w-full max-w-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden"
          >
             <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                   <div className="flex items-center gap-2 text-[#6a00f3] font-medium text-sm">
                      <div className="bg-[#6a00f3]/10 p-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      Successfully added to cart
                   </div>
                   <button 
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                   >
                      <X className="w-4 h-4" />
                   </button>
                </div>

                <div className="flex gap-3">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <Image
                            src={product.images?.[0]?.src || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-1 text-sm">{product.name}</h4>
                        <div className="flex items-center gap-2 text-sm mt-0.5">
                             <span className="text-gray-500">Qty: {quantity}</span>
                             <span className="font-semibold text-gray-900">₦{Number(product.price).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                   <Button 
                      asChild 
                      className="flex-1 h-8 text-xs font-medium bg-[#6a00f3] hover:bg-[#5a00d3]"
                   >
                      <Link href="/cart">View Cart ({cartItemCount})</Link>
                   </Button>
                   <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1 h-8 text-xs font-medium"
                   >
                      Continue Shopping
                   </Button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
