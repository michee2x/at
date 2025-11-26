"use client";
import { WooProduct } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

export type CartProducts = WooProduct & { quantity: number };

type CartContextType = {
  cart: CartProducts[];
  addToCart: (item: CartProducts) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  itemToDelete: CartProducts | null;
  setItemToDelete: (item: CartProducts) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProducts[]>([]);
  const [itemToDelete, setItemToDelete] = useState<CartProducts | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartProducts) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });

    const toastPayload = {
      slug: item.slug,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.images?.[0]?.src || null,
      time: Date.now(),
    };

    // Dispatch a custom event so the toast layer only reacts to explicit user actions
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cart:add", { detail: toastPayload })
      );
    }
  };

  const removeFromCart = (slug: string) =>
    setCart((prev) => prev.filter((i) => i.slug !== slug));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        itemToDelete,
        setItemToDelete,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
