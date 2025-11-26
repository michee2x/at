/* eslint-disable */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartToast from "@/sections/cart/CartToast";
import Link from "next/link";
import { BsBucket } from "react-icons/bs";
import { useCart } from "@/hooks/useCart";
import { WooProductImage, WooProductToCartItem } from "@/types";

/**
 * Event-driven CartToastContainer
 * - Listens for window 'cart:add' events (dispatched by your CartContext)
 * - Shows toasts *only* when those events occur (no flash on page load)
 * - Each toast gets an independent timer, hover pause/resume, and unique id
 */

type ToastPayload = {
  id: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: WooProductImage[];
  time?: number;
};

type VisibleToast = {
  id: string;
  payload: ToastPayload;
};

export default function CartToastContainer() {
  const { cart } = useCart();
  const [toasts, setToasts] = useState<VisibleToast[]>([]);
  const timersRef = useRef<Record<string, number | NodeJS.Timeout>>({});
  const AUTO_HIDE_MS = 5000;
  const LEAVE_HIDE_MS = 3000;

  useEffect(() => {
    // Handler that runs only when a user action dispatches a cart:add event
    const onAdd = (e: Event) => {
      const custom = e as CustomEvent<ToastPayload>;
      const payload = custom.detail;
      if (!payload || !payload.slug) return;

      // Unique id for this toast instance
      const id = `${payload.slug}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      // prepend newest first
      setToasts((prev) => [{ id, payload }, ...prev]);

      // start auto-hide timer
      timersRef.current[id] = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete timersRef.current[id];
      }, AUTO_HIDE_MS);
    };

    // Attach listener
    window.addEventListener("cart:add", onAdd as EventListener);

    return () => {
      // cleanup listener and any timers
      window.removeEventListener("cart:add", onAdd as EventListener);
      Object.values(timersRef.current).forEach((t) => clearTimeout(t as any));
      timersRef.current = {};
    };
  }, []);

  // Pause timer on hover
  const handleHover = (id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id] as any);
      delete timersRef.current[id];
    }
  };

  // Restart a shorter timer on leave
  const handleLeave = (id: string) => {
    if (timersRef.current[id]) clearTimeout(timersRef.current[id] as any);
    timersRef.current[id] = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timersRef.current[id];
    }, LEAVE_HIDE_MS);
  };

  if (toasts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="fixed lg:top-20 w-full h-fit right-0 bottom-0 lg:bottom-auto bg-white/5 backdrop-blur-[10px] p-[10px] lg:right-5 lg:w-fit z-[9999] flex flex-col gap-3"
    >
      <AnimatePresence>
        {toasts.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.32, delay: i * 0.03 }}
            onMouseEnter={() => handleHover(t.id)}
            onMouseLeave={() => handleLeave(t.id)}
          >
            <CartToast
              item={
                {
                  id: t.payload.id,
                  slug: t.payload.slug,
                  name: t.payload.name,
                  price: String(t.payload.price), // convert number → string
                  quantity: t.payload.quantity,
                  images: t.payload.image ? t.payload.image : [],
                } as WooProductToCartItem
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {toasts.length > 0 && (
          <motion.div
            key="view-cart"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
          >
            <Link
              href="/cart"
              className="bg-[#2B2B2B] h-[48px] hover:bg-[#1A1A1A] text-white rounded-[8px] py-[6px] px-[12px] text-sm font-medium flex justify-center gap-2.5 items-center"
            >
              <p className="lg:text-[16px] text-[14px]">
                <span className="mr-1.5">View Cart</span>
                <span>
                  (Total: ₦{cart && Number(cart.total).toLocaleString()})
                </span>
              </p>
              <div className="indicator">
                <span className="indicator-item text-[12px] lg:text-[14px] p-2 aspect-square text-white bg-[#ED473D] rounded-full badge badge-secondary">
                  {cart.items.length}
                </span>
                <div className="grid text-white text-2xl place-items-center">
                  <BsBucket />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
