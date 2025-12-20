"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WooProduct } from "@/types";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchParamsType } from "./page";
import { Ratings } from "@/components/Ratings";
import { useInView } from "react-intersection-observer";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useCart as useZustandCart } from "@/hooks/useCart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilter } from "@/contexts/filter-context";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface FilterSidebarProps {
  searchParams: SearchParamsType;
  brands?: string[]; // You can fetch from WooCommerce attributes
}

export function FilterSidebar({
  searchParams,
  brands = [],
}: FilterSidebarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { showFilter, setShowFilter } = useFilter();

  // Prevent background scroll when the overlay is open
  useLockBodyScroll(showFilter);

  function applyFilter(formData: FormData) {
    const query = new URLSearchParams(params.toString());

    // Price range
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;
    if (min) query.set("min_price", min);
    if (max) query.set("max_price", max);

    // Brand
    const brand = formData.get("brand") as string;
    if (brand) query.set("attribute:pa_brand", brand);

    // Sort
    const sort = formData.get("sort") as string;
    if (sort) query.set("orderby", sort);

    // Stock status
    const stock = formData.get("stock") as string;
    if (stock) query.set("stock_status", stock);

    // Reset to page 1
    query.set("page", "1");

    // Close overlay on mobile after applying
    setShowFilter(false);

    router.push(`?${query.toString()}`);
  }

  return (
    <>
      {/* Backdrop / Overlay for mobile */}
      <div
        className={`${
          showFilter ? "fixed inset-0 z-40 bg-gray-900/40 lg:hidden" : "hidden"
        }`}
        onClick={() => setShowFilter(false)}
        aria-hidden
      />

      {/* Sidebar: overlay on mobile when open, regular static sidebar on lg+ */}
      <div
        id="filter-sidebar"
        className={`transition-all duration-200 ${
          showFilter
            ? "fixed pt-16 left-0 top-0 z-[9999] w-full h-[calc(100vh-4rem)]  p-4 bg-white overflow-auto"
            : "hidden"
        } lg:block lg:static lg:w-auto lg:h-auto lg:overflow-visible`}
      >
        <Card className="h-fit rounded-2xl p-4 space-y-6">
          {/* Mobile header with close button */}
          <div className="w-full lg:hidden sticky top-0 bg-white flex items-center justify-between p-3 z-30">
            <span className="font-medium">Filters</span>
            <button
              type="button"
              onClick={() => setShowFilter(false)}
              aria-label="Close filters"
              className="text-lg"
            >
              ✕
            </button>
          </div>

          <form action={applyFilter} className="space-y-4">
            {/* Price Range */}
            <div>
              <p className="mb-2 text-sm font-medium">Price Range</p>
              <div className="flex gap-2">
                <Input
                  name="min"
                  placeholder="Min"
                  type="number"
                  defaultValue={searchParams.min_price || ""}
                />
                <Input
                  name="max"
                  placeholder="Max"
                  type="number"
                  defaultValue={searchParams.max_price || ""}
                />
              </div>
            </div>

            {/* Brand */}
            {brands.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Brand</p>
                <Select name="brand" defaultValue={searchParams.brand || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sort / Order */}
            <div>
              <p className="mb-2 text-sm font-medium">Sort By</p>
              <Select name="sort" defaultValue={searchParams.orderby || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Status */}
            <div>
              <p className="mb-2 text-sm font-medium">Stock Status</p>
              <Select
                name="stock"
                defaultValue={searchParams.stock_status || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export function ProductCard({ product }: { product: WooProduct }) {
  const { cart, addToCart } = useCart();
  const { updateQuantity, removeItem } = useZustandCart();
  const [justAdded, setJustAdded] = useState(false);
  
  // Track image loading state to show custom loader
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Lazy loading: Only render when card is in viewport
  // This improves performance by not rendering off-screen products
  const { ref, inView } = useInView({
    triggerOnce: true, // Load once and stay loaded
    threshold: 0.1, // Trigger when 10% of card is visible
    rootMargin: '50px', // Start loading slightly before entering viewport
  });

  // current quantity for this product from cart (fast, local)
  const currentQty = cart.find((i) => i.slug === product.slug)?.quantity ?? 0;

  function handleAddToCart() {
    // Instant optimistic add — updates local CartContext immediately
    addToCart({ ...product, quantity: 1 });

    // Also update global zustand cart so other consumers (e.g., CartToastContainer) reflect totals instantly
    try {
      const addItem = useZustandCart.getState()?.addItem;
      if (addItem) {
        // non-blocking: update store; the store sets new state synchronously before making any network calls
        addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          quantity: 1,
        });
      }
    } catch (e) {
      // swallow - don't block UX
      console.error("Failed to sync to global cart", e);
    }

    // tiny visual feedback for the user
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);

    // existing toast behavior will run via CartContext dispatch event
  }

  function handleIncrement() {
    const newQty = currentQty + 1;
    updateQuantity(product.id, newQty);
    
    // Also update local cart context
    addToCart({ ...product, quantity: 1 });
  }

  function handleDecrement() {
    if (currentQty <= 1) {
      removeItem(product.id);
      // Also remove from local cart context
      const cartItem = cart.find((i) => i.slug === product.slug);
      if (cartItem) {
        addToCart({ ...product, quantity: -currentQty });
      }
    } else {
      const newQty = currentQty - 1;
      updateQuantity(product.id, newQty);
      // Also update local cart context
      addToCart({ ...product, quantity: -1 });
    }
  }

  // Optimize performance by not rendering the full card if it's not in the viewport
  if (!inView) {
    return <div ref={ref} className="aspect-[3/4] bg-gray-50/50" />;
  }

  return (
    <Card ref={ref} className="group p-0 rounded-none border-none shadow-sm transition hover:shadow-md overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Product Image with Custom Loading State */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Custom Loading State: Pulsing Atlaze Logo */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="relative w-16 h-16 animate-pulse">
                <Image
                  src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
                  alt="Loading..."
                  fill
                  className="object-contain grayscale opacity-30"
                />
              </div>
            </div>
          )}
          
          {/* Actual Product Image */}
          <Image
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col flex-1 space-y-2 px-2 pb-2">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-sm font-medium leading-tight">{product.name}</h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              {product.average_rating && (
                <Ratings rating={parseFloat(product.average_rating)} starSize={14} />
              )}
              
            </div>

            <div className="flex justify-between mt-2 items-center">
              {/* Price */}
            <div className="text-base flex items-center gap-1 font-semibold text-primary">
            <div className="w-[14.5px] relative h-[14.5px] lg:w-[20px] lg:h-[20px]">
                    <Image
                      src="/home/hero/Nigeria.png"
                      alt="nigeria logo"
                      fill
                      className="object-cover"
                    />
                  </div>{Number(product.price).toLocaleString()}</div>
            {product.total_sales !== undefined && product.total_sales > 0 && (
                <span className="text-xs flex items-center gap-1 text-muted-foreground">({product.total_sales}) purchased</span>
              )}
            </div>
          </div>

          {/* Cart Controls - Always reserve space, show on hover */}
          <div className="min-h-[32px] flex items-end">
            {currentQty === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === "outofstock"}
                className={`h-8 bg-[#6a00f3] text-white rounded-sm w-full transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium ${
                  justAdded ? "scale-110 opacity-100" : ""
                }`}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-[#6a00f3] text-white rounded-sm justify-center h-8 px-1 w-full">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDecrement}
                  className="h-7 w-7 rounded-full hover:bg-background"
                  aria-label="Decrease quantity"
                >
                  <span className="text-lg leading-none">−</span>
                </Button>
                <span className="min-w-[24px] text-center text-sm font-medium">
                  {currentQty}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleIncrement}
                  className="h-7 w-7 rounded-full hover:bg-background"
                  aria-label="Increase quantity"
                >
                  <span className="text-lg leading-none">+</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);

  function goTo(p: number) {
    const query = new URLSearchParams(params.toString());
    query.set("page", p.toString());
    router.push(`?${query.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
      >
        Prev
      </Button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => goTo(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
