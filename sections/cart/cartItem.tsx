// components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DialogTrigger } from "@/components/ui/dialog";
import { CartItemType, useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { setItemQuantity, removeFromCart, setItemToDelete } = useCart();

  const decrease = () => {
    const newQty = Math.max(0, item.quantity - 1);
    setItemQuantity(item.key, newQty);
  };

  const increase = () => {
    const newQty = item.quantity + 1;
    setItemQuantity(item.key, newQty);
  };

  return (
    <div className="w-full px-[8px] py-[10px] border-y-[1px] border-[#EFEFEF] flex gap-2 h-auto">
      <div className="size-[80px] border-[2px] border-[#2B2B2B] rounded-lg overflow-hidden relative">
        <Image
          src={item.images?.[0]?.src || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex text-[16px] lg:text-[18px] items-center justify-between">
          <h1>{item.name}</h1>
          <h1>₦{Number(item.totals?.total || 0).toLocaleString()}</h1>
        </div>

        <span className="text-[14px] text-[#6C757D]">WooCommerce Product</span>

        <div className="flex text-[#6C757D] mt-1 items-center text-[14px] gap-[4rem]">
          <div>
            <span className="mr-3">Size</span>
            <span>-</span>
          </div>
          <div>
            <span className="mr-3">Quantity</span>
            <span>{item.quantity}</span>
          </div>
        </div>

        <div className="flex mt-3 gap-[10px] text-xl items-center">
          <div className="w-[99px] text-[#343A40] flex gap-2 items-center justify-center h-[36px] py-[12px] bg-[#F5F5F5] px-[8px] rounded-[50px]">
            <AiOutlineMinus className="cursor-pointer" onClick={decrease} />
            <span>{item.quantity}</span>
            <FiPlus className="cursor-pointer" onClick={increase} />
          </div>

          <button className="btn btn-circle">
            <CiHeart className="text-[24px]" />
          </button>

          <DialogTrigger asChild>
            <button
              onClick={() => setItemToDelete(item)}
              className="btn btn-circle"
            >
              <RiDeleteBin6Line className="text-[20px]" />
            </button>
          </DialogTrigger>
        </div>
      </div>
    </div>
  );
}
