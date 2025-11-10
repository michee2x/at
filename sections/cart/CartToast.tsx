"use client";
import { CartProducts, useCart } from "@/contexts/CartContext";
import Image from "next/image";

type CartToastProps = {
  product: CartProducts;
};

export default function CartToast({ product }: CartToastProps) {
  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="bg-white shadow-xl rounded-xl p-3 w-[280px] border border-gray-100">
      <div className="flex gap-3 items-center">
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          width={50}
          height={50}
          className="object-cover rounded-md index-10"
        />
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{product.name}</h4>
          <p className="text-xs text-gray-500">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
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

        <div className="flex w-fit h-fit bg-black text-white items-center gap-2">
          <button
            onClick={() => removeFromCart(product.slug)}
            className="px-2 py-1 border-0 outline-0 rounded text-sm"
          >
            –
          </button>
          <span className="text-sm font-medium">{product.quantity}</span>
          <button
            onClick={() => addToCart({ ...product, quantity: 1 })}
            className="px-2 py-1 border-0 outline-0 rounded text-sm"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
