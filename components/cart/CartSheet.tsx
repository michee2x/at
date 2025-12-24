"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
  const { cart, removeItem, updateQuantity } = useCart();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemCount = totalItems

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-auto bg-gray-100 justify-center text-left h-auto py-3 px-4 hover:bg-gray-200"
        >
          <ShoppingCart className="h-4 w-4 text-gray-700" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#6a00f3] text-[10px] font-bold text-white flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md h-[100dvh]">
        <SheetHeader className="flex-none px-6 py-4 text-left border-b">
          <SheetTitle className="text-2xl font-normal text-gray-900">Your cart (items: {itemCount})</SheetTitle>
        </SheetHeader>
        
        {itemCount === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-6 overflow-hidden">
            <div className="relative h-32 w-32 opacity-10">
              <ShoppingCart className="h-full w-full text-black" />
            </div>
            <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
            <SheetClose asChild>
                 <Button className="bg-black hover:bg-gray-800 text-white rounded-none px-8">
                  Continue Shopping
                </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto min-h-0 px-6">
              <div className="flex flex-col gap-8 py-6">
                {[...cart.items].reverse().map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    {/* Image */}
                    <div className="relative aspect-square h-24 w-24 min-w-[6rem] overflow-hidden bg-gray-100 shrink-0">
                      {item.images[0]?.src ? (
                         <Image
                          src={item.images[0].src}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50">
                          <ShoppingCart className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                         <Link href={`/product/${item.slug}`} className="text-base font-normal text-gray-900 underline underline-offset-2 hover:text-gray-600 line-clamp-2 leading-tight">
                          {item.name}
                        </Link>
                         <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                           ₦{item.price ? parseInt(item.price.replace(/[^0-9]/g, '')).toLocaleString() : 0}
                        </p>
                      </div>

                      {/* Mock Description/Attributes if available (using short_description or generic if empty for now as requested match) */}
                      <div className="text-sm text-gray-500 line-clamp-2 leading-relaxed my-1">
                         {item.short_description ? (
                            <div dangerouslySetInnerHTML={{ __html: item.short_description }} />
                         ) : (
                           <span>Premium quality product selected for you.</span>
                         )}
                      </div>

                       {/* Vendor - Mocking as 'Vendor' isn't always in cart item, but adding placeholder structure */}
                       <p className="text-sm text-gray-500 mb-2">
                        Vendor: <span className="text-gray-700">Atlaze Official</span>
                      </p>

                      {/* Controls */}
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex h-9 items-center border border-gray-300 rounded bg-white w-24">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-full px-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 flex items-center justify-center transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input 
                            type="text" 
                            value={item.quantity} 
                            readOnly 
                            className="w-full text-center text-sm font-medium border-none p-0 focus:ring-0 h-full text-black"
                          />
                          <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                             className="h-full px-3 hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2"
                        >
                          Remove item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           
            <div className="flex-none p-6 border-t border-gray-100 bg-white mt-auto z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between text-lg font-bold text-gray-900 mb-1">
                  <span>Subtotal</span>
                  <span>₦{cart.total ? parseInt(cart.total.toString().replace(/[^0-9]/g, '')).toLocaleString() : '0.00'}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6 font-normal">Shipping and discounts calculated at checkout.</p>
              
              <div className="flex gap-4">
                 <SheetClose asChild className="flex-1">
                    <Link href="/cart">
                        <Button variant="outline" className="w-full h-12 border-black text-black text-base hover:bg-gray-50 rounded-none font-normal">
                            View my cart
                        </Button>
                    </Link>
                 </SheetClose>
                 <SheetClose asChild className="flex-1">
                    <Link href="/checkout">
                        <Button className="w-full h-12 bg-black hover:bg-gray-800 text-white text-base rounded-none font-normal">
                            Go to checkout
                        </Button>
                    </Link>
                 </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
