"use client";
import { useCart } from "@/hooks/useCart";
import { WooProductToCartItem } from "@/types";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";

type CartToastProps = {
  item: WooProductToCartItem;
};

export default function CartToast({ item }: CartToastProps) {
  const setItemToDelete = useCart((state) => state.setItemToDelete);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const cartItems = useCart((state) => state.cart.items);
  const cartItem = cartItems.find((i) => i.id === item.id);

  const increase = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };


  console.log("CartToast | rendering toast for item:", item);

  return (
    <div className="rounded-xl w-full p-3 lg:w-[393px]">
      <div className="flex gap-3 items-center">
        <div className="size-[50px] bg-white rounded-full overflow-hidden border border-black index-10 relative">
          <Image
            src={item.images?.[0]?.src || "/placeholder.png"}
            alt={item.name}
            fill
            className="object-cover aspect-square"
          />
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{item.name}</h4>
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
                {item?.price}
              </span>
            </div>
          </div>
          <div className="flex w-fit rounded-full h-fit bg-black text-white items-center gap-2">
            <button
              onClick={() => setItemToDelete(item)}
              className="px-2 py-1 border-0 outline-0 rounded text-sm"
            >
              <RiDeleteBin6Line className="lg:text-[20px] text-[16px]" />
            </button>
            <span className="text-sm font-medium">
              {cartItem?.quantity || 0}
            </span>
            <button
              onClick={increase}
              className="px-2 py-1 border-0 outline-0 rounded text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
