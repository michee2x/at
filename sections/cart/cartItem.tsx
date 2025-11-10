"use client";

import { CartProducts, useCart } from "@/contexts/CartContext";
import { WooProduct } from "@/types";
import Image from "next/image";
import React from "react";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineMinus } from "react-icons/ai";
import { DialogTrigger } from "@radix-ui/react-dialog";

const CartItem = ({ product }: { product: CartProducts }) => {
  const { addToCart, setItemToDelete } = useCart();
  return (
    <div className="w-full px-[8px] py-[10px] border-y-[1px] border-[#EFEFEF] flex gap-2 h-auto">
      <div className="size-[80px] border-[2px] border-[#2B2B2B] rounded-lg overflow-hidden relative">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex text-[16px] lg:text-[18px] items-center justify-between">
          <h1>Nike Air Jordan 1</h1>
          <h1>Price: #90,070</h1>
        </div>
        <span className="text-[14px] text-[#6C757D]">Grey Colour</span>

        <div className="flex text-[#6C757D] mt-1 items-center text-[14px] gap-[4rem]">
          <div>
            <span className="mr-3">Size</span>
            <span>44</span>
          </div>
          <div>
            <span className="mr-3">Quantity</span>
            <span>{product.quantity || "no quantity"}</span>
          </div>
        </div>

        <div className="flex mt-3 gap-[10px] text-xl items-center">
          <div className="w-[99px] text-[#343A40] flex gap-2 items-center justify-center h-[36px] py-[12px] bg-[#F5F5F5] px-[8px] rounded-[50px]">
            <AiOutlineMinus
              onClick={() => {
                product.quantity > 1 &&
                  addToCart({ ...product, quantity: -1 });
              }}
            />

            <span>{product.quantity || "no quantity"}</span>
            <FiPlus onClick={() => addToCart({ ...product, quantity: 1 })} />
          </div>

          <button className="btn btn-circle">
            <CiHeart className="text-[24px]" />
          </button>
          <DialogTrigger asChild>
            <button
              onClick={() => setItemToDelete(product)}
              className="btn btn-circle"
            >
              <RiDeleteBin6Line className="text-[20px]" />
            </button>
          </DialogTrigger>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
