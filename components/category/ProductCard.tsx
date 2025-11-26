// /components/product/ProductCard.tsx
"use client";

import Image from "next/image";
import { Ratings } from "../Ratings";
import { WooProduct } from "@/types";
import { GoPlus } from "react-icons/go";
import { DrawerTrigger } from "../ui/drawer";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export function ProductCard({ product }: { product: WooProduct }) {
  const {isLoading, addItem, cart} = useCart();

  // const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      console.log("ProductCard | add to cart clicked:", product.id);

      const status = await addItem({ ...product, quantity: 1 });
      console.log("ProductCard | addItem status:", status);

      // Get fresh cart from the store
      const updatedCart = useCart.getState().cart;

      const addedItem = updatedCart.items.find(
        (item) => item.id === product.id
      );
      console.log("ProductCard | addedToCart item:", addedItem);

      if (addedItem) {
        //toast.success("Added to cart");
        const toastPayload = {
          id: addedItem.id,
          slug: addedItem.slug,
          name: addedItem.name,
          price: Number(addedItem.price),
          quantity: addedItem.quantity,
          image: addedItem.images || null,
          time: Date.now(),
        };

        // Dispatch a custom event so the toast layer only reacts to explicit user actions
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cart:add", { detail: toastPayload })
          );
        }
      }
    } catch (err) {
      console.error("ProductCard | addToCart error:", err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };



  return (
    <div className="border border-gray-200 pb-2 font-poppins bg-white rounded-xl flex flex-col">
      <DrawerTrigger>
        <div className="relative w-full aspect-square mb-3">
          <Image
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="px-3 w-full overflow-hidden h-auto">
          <div className="lg:text-[15px] text-[13px] flex flex-col font-medium text-black mb-1">
            <h2 className="text-start hidden">{`${product.name.slice(
              0,
              19
            )}...`}</h2>
            <h2 className="text-start lg:hidden">{`${product.name.slice(
              0,
              16
            )}...`}</h2>
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
                  {Number(product.price).toLocaleString()}
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
        disabled={isAdding}
        className="lg:mt-5 mt-2 w-[97%] mx-auto text-[10px] bg-[#6A00EF] text-white py-[6px] rounded-[24px] hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed items-center gap-1 justify-center flex transition"
      >
        <GoPlus className="text-2xl" />
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
