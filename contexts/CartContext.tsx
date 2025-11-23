"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface CartTotals {
  total_items: string;
  total_price: string;
  currency: string;
  subtotal?: string;
  discount_total?: string;
  shipping_total?: string;
  [key: string]: string | undefined;
}

export interface CartItemType {
  key: string;
  id: number;
  name: string;
  quantity: number;
  totals?: { total: string };
  images?: { src: string }[];
}

export interface CartResponse {
  items: CartItemType[];
  totals: CartTotals;
  items_count?: number;
}

type CartContextType = {
  cart: CartResponse | null;
  loading: boolean;
  itemToDelete: CartItemType | null;
  setItemToDelete: (item: CartItemType | null) => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  setItemQuantity: (key: string, quantity: number) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemToDelete, setItemToDelete] = useState<CartItemType | null>(null);

  // init cart token once
  useEffect(() => {
    async function init() {
      let token = localStorage.getItem("cartToken");

      if (!token) {
        const res = await fetch("/api/cart/token");
        if (res.ok) {
          const data: { token?: string; cart?: { token?: string } } =
            await res.json();

          token = data.token ?? data.cart?.token ?? null;

          if (token) {
            localStorage.setItem("cartToken", token);
          }
        }
      }

      setCartToken(token);
    }
    init();
  }, []);

  // fetch cart
  useEffect(() => {
    if (!cartToken) return;

    (async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/cart/get", {
          headers: { "Cart-Token": cartToken },
        });

        if (res.ok) {
          const data: CartResponse = await res.json();
          setCart(data);
        } else {
          setCart(null);
        }
      } catch (err) {
        console.error("Cart fetch error", err);
        setCart(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [cartToken]);

  async function refreshCart() {
    if (!cartToken) return;

    try {
      const res = await fetch("/api/cart/get", {
        headers: { "Cart-Token": cartToken },
      });

      const data: CartResponse = await res.json();
      setCart(data);
    } catch (err) {
      console.error("refreshCart err", err);
    }
  }

  async function addToCart(productId: number, quantity = 1) {
    if (!cartToken) {
      toast.error("No cart token");
      return;
    }

    try {
      const res = await fetch("/api/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cart-Token": cartToken,
        },
        body: JSON.stringify({ id: productId, quantity }),
      });

      const json: { message?: string } = await res.json();

      const newToken = res.headers.get?.("cart-token") ?? null;
      if (newToken) {
        localStorage.setItem("cartToken", newToken);
        setCartToken(newToken);
      }

      if (res.ok) {
        toast.success("Added to cart");
        await refreshCart();
      } else {
        toast.error(json.message || "Failed to add");
      }
    } catch (err) {
      console.error("addToCart", err);
      toast.error("Network error");
    }
  }

  async function setItemQuantity(key: string, quantity: number) {
    if (!cartToken) {
      toast.error("No cart token");
      return;
    }

    try {
      const q = Math.max(0, Math.floor(quantity));

      if (q === 0) {
        await removeFromCart(key);
        return;
      }

      const res = await fetch(
        `/api/cart/items/${encodeURIComponent(key)}?quantity=${q}`,
        {
          method: "PUT",
          headers: { "Cart-Token": cartToken },
        }
      );

      const json: { message?: string } = await res.json();

      if (res.ok) {
        await refreshCart();
      } else {
        toast.error(json.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("setItemQuantity error", err);
      toast.error("Network error");
    }
  }

  async function removeFromCart(key: string) {
    if (!cartToken) {
      toast.error("No cart token");
      return;
    }

    try {
      const res = await fetch(`/api/cart/items/${encodeURIComponent(key)}`, {
        method: "DELETE",
        headers: { "Cart-Token": cartToken },
      });

      const json: { message?: string } = await res.json();

      if (res.ok) {
        toast.success("Item removed");
        setItemToDelete(null);
        await refreshCart();
      } else {
        toast.error(json.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("removeFromCart", err);
      toast.error("Network error");
    }
  }

  const value: CartContextType = {
    cart,
    loading,
    itemToDelete,
    setItemToDelete,
    addToCart,
    setItemQuantity,
    removeFromCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// "use client";
// import { WooProduct } from "@/types";
// import { createContext, useContext, useEffect, useState } from "react";

// export type CartProducts = WooProduct & { quantity: number };

// type CartContextType = {
//   cart: CartProducts[];
//   addToCart: (item: CartProducts) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   itemToDelete: CartProducts | null;
//   setItemToDelete: (item: CartProducts) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<CartProducts[]>([]);
//   const [itemToDelete, setItemToDelete] = useState<CartProducts | null>(null);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) setCart(JSON.parse(stored));
//   }, []);

//   // Sync to localStorage whenever cart changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (item: CartProducts) => {
//     setCart((prev) => {
//       const existing = prev.find((i) => i.slug === item.slug);
//       if (existing) {
//         return prev.map((i) =>
//           i.slug === item.slug
//             ? { ...i, quantity: i.quantity + item.quantity }
//             : i
//         );
//       }
//       return [...prev, item];
//     });

//     const toastPayload = {
//       slug: item.slug,
//       name: item.name,
//       price: Number(item.price),
//       quantity: item.quantity,
//       image: item.images?.[0]?.src || null,
//       time: Date.now(),
//     };

//     // Dispatch a custom event so the toast layer only reacts to explicit user actions
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(
//         new CustomEvent("cart:add", { detail: toastPayload })
//       );
//     }
//   };

//   const removeFromCart = (slug: string) =>
//     setCart((prev) => prev.filter((i) => i.slug !== slug));

//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         clearCart,
//         itemToDelete,
//         setItemToDelete,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
