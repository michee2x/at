// ===============================
// PRODUCTION-GRADE CATEGORY PAGE (SSR + FILTERS + PAGINATION)
// Headless WooCommerce + Next.js App Router
// ===============================

// =====================================================
// app/category/[slug]/page.tsx (SERVER COMPONENT)
// =====================================================
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { FilterSidebar } from "./client";
import { Pagination } from "./client";
import { ProductSkeleton } from "@/components/category/skeleton/product-skeleton"; // or correct relative import
import Image from "next/image"

import FilterToggle from "@/components/FilterToggle";

import { WooProduct } from "@/types";

const returnParams = (searchParams: SearchParamsType) => {
  // Add all potential query params dynamically
  return {
    category: searchParams.category,
    per_page: PER_PAGE.toString(),
    page: searchParams.page ?? "1",
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    orderby: searchParams.orderby,
  };
};

export interface SearchParamsType {
  page?: string;
  min_price?: string;
  max_price?: string;
  orderby?: string;
  category?: string;
  stock_status?: string;
  brand?: string;
}

export interface PageProps {
  params: { slug: string };
  searchParams: Promise<SearchParamsType>;
}

const PER_PAGE = 40;

async function getCategoryProducts(
  searchParams: SearchParamsType
): Promise<{ products: WooProduct[]; totalPages: number }> {
  const page = Number(searchParams.page ?? 1);

  const queryObj: Record<string, string> = {};

  // Only keep defined values
  Object.entries(returnParams(searchParams)).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryObj[key] = value;
    }
  });

  // Build URLSearchParams safely
  const query = new URLSearchParams(queryObj);

  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `https://atlaze.com/wp-json/wc/v3/products?${query.toString()}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      next: { revalidate: 60 },
    }
  );

  const products = await res.json();
  console.log(
    "\n\n\n\n\n\nthis is the second category products: ",
    products,
    query.toString(),
    res.status,
    res.statusText
  );

  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  return { products, totalPages };
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

  if (!products.length) notFound();

  return (
    <div className="container mx-auto px-1 py-6">
      <Carousel />

      <div className="grid mt-8 sticky top-0 grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <div className="px-4 hidde">
          <FilterSidebar searchParams={resolvedSearchParams} />
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
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
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

export function ProductGrid({ products }: ProductGridProps) {
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
