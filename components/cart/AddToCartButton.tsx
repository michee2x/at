"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WooProduct } from "@/types";
import { toast } from "react-toastify";
import { ToastCartSuccess } from "./ToastCartSuccess";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: WooProduct;
  quantity?: number;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "icon" | "full";
  showText?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  onSuccess?: () => void;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = "default",
  showText = true,
  size = "default",
  onSuccess
}: AddToCartButtonProps) {
  const { cart, addItem, updateQuantity, removeItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Sync with store
  const currentQty = cart.items.find((i) => i.id === product.id)?.quantity ?? 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);

    try {
      await addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
        quantity: quantity,
      });
      
      toast(<ToastCartSuccess product={product} quantity={quantity} />, {
         icon: false, // We provide our own icon in the component
         className: "p-0",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = currentQty + 1;
    await updateQuantity(product.id, newQty);
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty <= 1) {
      await removeItem(product.id);
    } else {
      await updateQuantity(product.id, currentQty - 1);
    }
  };

  const isOutOfStock = product.stock_status === "outofstock";

  const renderContent = () => {
    // 1. Quantity Controls (Item in Cart)
    if (currentQty > 0) {
      if (variant === "full") {
        return (
          <div className={cn("flex items-center gap-1.5 bg-[#6a00f3] text-white rounded-lg justify-between h-9 px-2 w-full", className)}>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecrement}
              className="h-7 w-7 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-lg leading-none font-bold">−</span>
            </Button>
            <span className="min-w-[28px] text-center text-sm font-bold">
              {currentQty}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleIncrement}
              className="h-7 w-7 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-lg leading-none font-bold">+</span>
            </Button>
          </div>
        );
      }

      // Default variant quantity controls
      return (
        <div className={cn("flex items-center justify-between px-6 w-full", className)}>
           <button 
             onClick={handleDecrement} 
             className="text-xl font-bold px-2 hover:opacity-80 transition-opacity"
             aria-label="Decrease quantity"
           >
             −
           </button>
           <span className="font-bold text-lg">{currentQty}</span>
           <button 
             onClick={handleIncrement} 
             className="text-xl font-bold px-2 hover:opacity-80 transition-opacity"
             aria-label="Increase quantity"
           >
             +
           </button>
        </div>
      );
    }

    // 2. Add to Cart Button (Item NOT in Cart)
    if (variant === "full") {
      return (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={cn(
            "h-9 bg-[#6a00f3] text-white rounded-lg w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#5a00d3]",
            isAdding ? "scale-100 opacity-90" : "hover:scale-[1.02]",
            className
          )}
          aria-label="Add to cart"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isAdding ? "Adding..." : "Add to cart"}</span>
          <span className="sm:hidden">{isAdding ? "..." : "Add"}</span>
        </button>
      );
    }

    return (
      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        variant={variant === "icon" ? "secondary" : (variant as "default" | "outline" | "ghost")}
        size={size}
        className={cn(
          "transition-all duration-300 relative overflow-hidden",
          variant === "default" && "bg-[#6a00f3] hover:bg-[#5a00d3] text-white",
          className
        )}
      >
        {isAdding ? (
          <Loader2 className={cn("h-4 w-4 animate-spin", showText && "mr-2")} />
        ) : (
          <ShoppingCart className={cn("h-4 w-4", showText && "mr-2")} />
          // Note: If you want just text or different icon for default variant
        )}
        
        {showText && (
          <span>
            {isOutOfStock 
              ? "Out of Stock" 
              : isAdding 
                ? "Adding..." 
                : "Add to Cart"}
          </span>
        )}
        {!showText && <span className="sr-only">Add to Cart</span>}
      </Button>
    );
  };

  return (
    <>
      {renderContent()}
      </>
    );
  }
