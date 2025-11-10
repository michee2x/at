"use client";

import Image from "next/image";
import { Ratings } from "../Ratings";
import { WooProduct } from "@/types";
import { GoPlus } from "react-icons/go";
import { DrawerTrigger } from "../ui/drawer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";
import CartToast from "@/sections/cart/CartToast";

export function ProductCard({ product }: { product: WooProduct }) {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    const item = { ...product, quantity: 1 };
    addToCart(item);

    // show popup
    toast(<CartToast product={item} />, {
      icon: false,
      closeButton: false,
      hideProgressBar: true,
      autoClose: 4000,
      pauseOnHover: true,
      className: "!bg-transparent !shadow-none !p-0 !m-0",
    });
  };
  return (
    <div className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col">
      <DrawerTrigger>
        <div className="relative w-full aspect-square mb-3">
          <Image
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover index-10"
          />
        </div>
        <div className="px-3 w-full overflow-hidden h-auto">
          <div className="lg:text-[15px] text-[14px] flex flex-col font-medium text-black mb-1">
            <h2 className="text-start">{`${product.name.slice(0, 19)}...`}</h2>
            <span className="flex justify-start -ml-2">
              <Ratings rating={3.2} />
            </span>
          </div>
          <div className="flex mt-3 flex-col justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
                  <Image
                    src="/home/hero/Nigeria.png"
                    className="object-cover"
                    alt="nigeria logo"
                    fill
                  />
                </div>
                <span className="text-[12px] lg:text-[14px] text-[#6A00EF]">
                  {product.price.slice(0, 10)}
                </span>
              </div>
              <span className="text-[10px] w-full flex text-black/50">
                300+ purchased
              </span>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <button
        onClick={handleAddToCart}
        className="lg:mt-5 mt-2 w-[97%] mx-auto text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 items-center gap-1 justify-center flex transition"
      >
        <GoPlus className="text-2xl" />
        Add to Cart
      </button>
    </div>
  );
}
