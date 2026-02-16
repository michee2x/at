// /app/product/[id]/page.tsx
import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductImageZoomWrapper from "./ProductImageZoomWrapper";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { WooProduct } from "@/types";
import { Ratings } from "@/components/Ratings";
import { ProductDescription } from "@/components/category/productDesc";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import ProductSuggestionList from "@/components/productdetails/suggestionCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { FollowStoreButton } from "@/components/product/FollowStoreButton";

export const revalidate = 3600; // Revalidate this page every hour

//https://api.atlaze.com/wp-json/wc/v3/products?slug=noise-buds-n1
//https://api.atlaze.com/wp-json/wc/v3/products?slug=noise-buds-n1
/**
 * Assumptions & notes:
 * - This is an app-router server component (file under /app/product/[id]/page.tsx).
 * - EXPOSED ENV:
 *    WC_CONSUMER_KEY and WC_CONSUMER_SECRET must be set in your environment.
 * - next.config.js must allow external image domains (see note below).
 * - We use Next's fetch with `next: { revalidate: 3600 }` for ISR (1 hour).
 * - Keep meta tags and add JSON-LD for product structured data.
 */

/* -------------------------
   Types (lightweight)
   ------------------------- */
/* -------------------------
   Helper: fetch product by id
   - uses query params for WooCommerce auth (simpler & avoids Basic header issues)
   - throws on non-200 to allow notFound
   ------------------------- */
async function fetchProduct(productSlug: string): Promise<WooProduct> {
  if (!productSlug) throw new Error("Missing product id");

  const base = process.env.WC_API_BASE ?? "https://api.atlaze.com/wp-json/wc/v3";
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret)
    throw new Error("Missing WC consumer key/secret env variables");

  const url = `${base}/products?slug=${encodeURIComponent(productSlug)}`;

  // Encode credentials as Base64 for Basic Auth
  const authHeader =
    "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");

  console.log("\n🔍 Fetching product slug:", productSlug, "\nURL:", url, "\n");

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    }
  });

  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch product (${res.status}): ${text}`);
  }

  const data = (await res.json()) as WooProduct[];
  return data[0]; // since Woo returns an array for slug query
}


/* -------------------------
   Metadata (dynamic)
   ------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    const title = product.name ? `${product.name}` : "Product | Atlaze";
    const description =
      product.short_description || product.description || "Product on Atlaze";
    const image = product.images?.[0]?.src ?? null;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : undefined,
      },
      robots: "index, follow",
    };
  } catch (err) {
    return { title: "Product Not Found" };
  }
}

/* -------------------------
   Page (server component)
   ------------------------- */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slug = id;

  let product: WooProduct | null = null;
  try {
    product = await fetchProduct(slug);
  } catch (err) {
    // If fetch fails, show 404 page to Next
    console.error("product fetch error:", err);
    notFound();
  }

  // At this point product is guaranteed non-null
  const image = product!.images?.[0]?.src ?? null;

  return (
    <main className="container w-full mx-auto md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] font-poppins px-2 py-8">
      {/* Breadcrumb — keep semantic & crawlable links */}
      {/* Breadcrumb — keep semantic & crawlable links */}
      <Breadcrumbs 
        items={[
          { 
            label: product?.categories[0]?.name?.replace("&amp;", "") || "Category",
            href: `/categories?cat=${product?.categories[0]?.id}`
          },
          { label: "Product Details" }
        ]} 
      />

      <article
        className="mt-8 flex flex-col lg:flex-row gap-5"
        itemScope
        itemType="http://schema.org/Product"
      >
        {/* Left: Images */}
        <Suspense fallback={<ImageGallerySkeleton />}>
          <ProductMediaGallery product={product} />
        </Suspense>

        {/* Right: Info */}
        <section className="flex-1 px-2">
          <Suspense fallback={<HeaderSkeleton />}>
            <ProductHeader product={product!} />
          </Suspense>



          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-center">
            <div className="w-full lg:w-1/2">
              <AddToCartButton 
                product={product!}
                className="w-full bg-[#660fcf] rounded-full text-white py-6 hover:bg-[#5300b8] h-12 text-base font-semibold shadow-lg shadow-purple-500/20"
                showText={true}
              />
            </div>
            <Link 
              href="/cart"
              className="w-full lg:w-1/2 flex items-center justify-center border border-black text-black rounded-full h-12 hover:border-[#4c1292] hover:text-[#4c1292] transition-colors font-semibold"
            >
              Go to Cart
            </Link>
          </div>
        </section>
      </article>

      <Suspense fallback={<DescriptionSkeleton />}>
        <ProductDescription product={product!} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={product!.id} productSlug={product!.slug} />
      </Suspense>

      <Suspense fallback={<ProductSuggestionSkeleton />}>
        <ProductSuggestion relatedIds={product?.related_ids || []} />
      </Suspense>

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product!.name ?? undefined,
            image:
              product!.images?.map((i) => i.src).filter(Boolean) ?? undefined,
            description:
              product!.short_description ?? product!.description ?? undefined,
            sku: product!.sku ?? undefined,
            offers: {
              "@type": "Offer",
              price: product!.price ?? undefined,
              priceCurrency: "USD", // adapt to actual currency if available
              availability: "https://schema.org/InStock",
              url:
                typeof window === "undefined"
                  ? undefined
                  : window.location?.toString(),
            },
          }),
        }}
      />
    </main>
  );
}

/* -------------------------
   Subcomponents (server)
   ------------------------- */

// ... imports
// ... existing code ...

import { isFollowingStore } from "@/lib/actions/store/follow";

async function ProductHeader({ product }: { product: WooProduct }) {
  let isFollowing = false;
  if (product.store?.id) {
    isFollowing = await isFollowingStore(product.store.id);
  }

  return (
    <header className="font-poppins">
      <h1 className="text-3xl font-bold" itemProp="name">
        {product.name}
      </h1>
      <p className="text-[15px] font-poppins text-[#7E7E7E]" aria-hidden>
        {/* Keep semantic category info if available; fallback */}
        {product?.categories[0]?.name?.replace("&amp;", "")?.toLowerCase()}
      </p>

      {/* Vendor / Store Info */}
      {product.store && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sold by:</span>
          <Link 
            href={`/vendor/${product.store.id}`}
            className="font-medium text-primary hover:text-violet-600 hover:underline transition-colors flex items-center gap-1"
          >
            {product.store.shop_name || product.store.name}
            <GoArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <div className="flex flex-row flex-nowrap items-start text-[14px] lg:gap-0.5 mt-2">
        <Ratings rating={product.rating_count} />
      </div>
      <p
        className="text-[15px] mt-4 text-[#111111] font-semibold"
        itemProp="offers"
        itemScope
        itemType="http://schema.org/Offer"
      >
        NGN{product.price}
      </p>
    </header>
  );
}



// -------------------------
// Product Suggestions (server component)
// -------------------------
async function ProductSuggestion({ relatedIds }: { relatedIds?: number[] }) {
  if (!relatedIds || relatedIds.length === 0) return null;

  const base = process.env.WC_API_BASE ?? "https://api.atlaze.com/wp-json/wc/v3";
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;

  // Fetch all related products in parallel
  const productPromises = relatedIds.map(async (id) => {
    
    const res = await fetch(
      `${base}/products/${id}?consumer_key=${key}&consumer_secret=${secret}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    console.log("Fetched related product:", data);
    return data;
  });

  // Wait for all requests to finish
  const results = await Promise.all(productPromises);

  // Remove nulls and duplicates by product ID
  const suggestions = Array.from(
    new Map(results.filter(Boolean).map((p) => [p.id, p])).values()
  );

  if (suggestions.length === 0) return null;


  return (
    <section
      aria-labelledby="suggestion-title px-4"
      className="w-full h-auto font-display mt-10"
    >
      <h2 id="suggestion-title" className="text-gray-900 py-3">
        YOU MAY ALSO LIKE
      </h2>

      <ProductSuggestionList suggestions={suggestions} />
    </section>
  );
}



/* -------------------------
   Skeletons (client-safe simple placeholders)
   ------------------------- */
export function ProductSuggestionSkeleton() {
  return (
    <section className="mt-10 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-md aspect-square"
          ></div>
        ))}
      </div>
    </section>
  );
}


function HeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
      <div className="h-6 w-1/4 bg-gray-200 rounded mt-2"></div>
    </div>
  );
}

function ImageGallerySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 bg-gray-200 rounded-md"></div>
        <div className="h-48 bg-gray-200 rounded-md"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded-md"></div>
    </div>
  );
}

function SizeChartSkeleton() {
  return (
    <div className="mt-4 animate-pulse">
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      <div className="mt-2 h-32 bg-gray-200 rounded"></div>
    </div>
  );
}


function DescriptionSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mt-2"></div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="mt-12 animate-pulse w-full max-w-[800px]">
      <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
      <div className="space-y-6">
         {[1, 2].map(i => (
            <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-16 w-full bg-gray-200 rounded" />
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}

