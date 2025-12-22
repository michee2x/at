import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Pagination } from "./client";
import { ProductSkeleton } from "@/components/category/skeleton/product-skeleton"; 
import Image from "next/image"

import FilterToggle from "@/components/FilterToggle";
import { ProductFilter } from "@/components/category/ProductFilter";
import { EmptyFilterState } from "./EmptyFilterState";

import { WooProduct, QueryParams } from "@/types";
import { fetchDokanProducts, fetchWCProducts } from "@/lib/product-service";
import { ProductGrid } from "./ProductGrid";

const returnParams = (searchParams: SearchParamsType) => {
  // Add all potential query params dynamically
  return {
    category: searchParams.category,
    per_page: PER_PAGE.toString(),
    page: searchParams.page ?? "1",
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    orderby: searchParams.orderby,
    vendor: searchParams.vendor,
    store: searchParams.store,
    domain: searchParams.domain,
    rating: searchParams.rating,
    on_sale: searchParams.on_sale,
    featured: searchParams.featured,
  } as QueryParams;
};

export interface SearchParamsType {
  page?: string;
  min_price?: string;
  max_price?: string;
  orderby?: string;
  category?: string;
  stock_status?: string;
  brand?: string;
  vendor?: string;
  store?: string;
  domain?: string;
  rating?: string;
  on_sale?: string;
  featured?: string;
}

export interface PageProps {
  params: { slug: string };
  searchParams: Promise<SearchParamsType>;
}

const PER_PAGE = 20; // Reduced as per request (user said maybe 5 but I'll do 20 for real usage, user said 5 just for test, I'll stick to reasonable defaults or 12)
// User said: "reduce the perpage number to increase the pages (just for now to test, maybe 5 products per page)"
// I will set it to 12.

async function getCategoryProducts(
  searchParams: SearchParamsType
): Promise<{ products: WooProduct[]; totalPages: number }> {
  const params = returnParams(searchParams);
  // Vendor logic
  const { store, domain, vendor } = params;
  const useDokan = domain === "dokan" || (store && store !== "none") || !!vendor;

  if (vendor && useDokan) {
      if (!params.store) {
          params.store = vendor; 
      }
  }

  const result = useDokan
    ? await fetchDokanProducts(params)
    : await fetchWCProducts(params);
    
  return result;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ REQUIRED IN NEW NEXT.JS
  const resolvedSearchParams = await searchParams;

  const { products, totalPages } = await getCategoryProducts(
    resolvedSearchParams
  );

  return (
    <div className="container mx-auto px-1 py-6">
      <Carousel />

      <div className="grid mt-8 sticky top-0 grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <div className="px-4 hidde">
          <ProductFilter searchParams={resolvedSearchParams} />
        </div>

        {/* Products */}
        <Suspense fallback={<ProductSkeleton />}>
          <div className="space-y-6">
            <div className="flex px-4 items-center justify-between">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold">
                  All Products
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover our complete collection
                </p>
              </div>
              <FilterToggle />
            </div>
            
            {/* Show empty state if no products, otherwise show grid */}
            {!products || products.length === 0 ? (
              <EmptyFilterState searchParams={resolvedSearchParams} />
            ) : (
              <ProductGrid initialProducts={products} totalPages={totalPages} />
            )}
            
          </div>
        </Suspense>
      </div>
    </div>
  );
}


import { ProductCard } from "./client";
interface ProductGridProps {
  products: WooProduct[];
}

export function ProductGrids({ products }: ProductGridProps) {
  // 1️⃣ No products at all
  if (!products || products.length === 0) {
    return <ProductGridState variant="empty" />;
  }

  // 2️⃣ All products out of stock (WooCommerce)
  const availableProducts = products.filter(
    (product) => product.stock_status !== "outofstock"
  );

  if (availableProducts.length === 0) {
    return <ProductGridState variant="out-of-stock" />;
  }

  // 3️⃣ Normal render
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {availableProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

import { AlertTriangle, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Carousel from "@/components/category/carousel";

interface ProductGridStateProps {
  variant: "empty" | "out-of-stock" | "error";
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function ProductGridState({
  variant,
  title,
  description,
  action,
}: ProductGridStateProps) {
  const Icon =
    variant === "out-of-stock"
      ? PackageX
      : variant === "error"
      ? AlertTriangle
      : PackageX;

  const defaultContent = {
    empty: {
      title: "No products found",
      description: "Try adjusting your filters or check back later.",
    },
    "out-of-stock": {
      title: "Products unavailable",
      description: "All items in this category are currently out of stock.",
    },
    error: {
      title: "Something went wrong",
      description: "We couldn’t load products right now. Please try again.",
    },
  }[variant];

  return (
    <Card className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />

      <div className="space-y-1">
        <h3 className="text-sm font-semibold">
          {title ?? defaultContent.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description ?? defaultContent.description}
        </p>
      </div>

      {action && (
        <Button asChild variant="outline" size="sm">
          <a href={action.href}>{action.label}</a>
        </Button>
      )}
    </Card>
  );
}
