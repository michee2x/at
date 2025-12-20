// components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { WooProductToCartItem } from "@/types";
import { Heart, Trash2 } from "lucide-react";
import { toNumber } from "@/utils/to-number";

interface CartItemProps {
  item: WooProductToCartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const setItemToDelete = useCart((state) => state.setItemToDelete);
  const updateQuantity = useCart((state) => state.updateQuantity);

  const decrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const increase = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 lg:gap-6 py-2">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <Image
          src={item.images?.[0]?.src || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900 line-clamp-2 pr-4">{item.name}</h3>
            <p className="text-sm text-muted-foreground">Unit Price: ₦{Number(item.price).toLocaleString()}</p>
          </div>
          <p className="font-bold text-gray-900 text-lg">
            ₦{(item.quantity * toNumber(item.price)).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white">
              <button 
                onClick={decrease}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label="Decrease quantity"
              >
                <AiOutlineMinus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button 
                onClick={increase}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            
            <DialogTrigger asChild>
              <button
                onClick={() => setItemToDelete(item)}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </DialogTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
