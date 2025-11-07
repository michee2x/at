// /app/product/[id]/page.tsx
import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductImageZoomWrapper from "./ProductImageZoomWrapper";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { WooProduct } from "@/types";
import SuggestionCardWrapper from "@/components/productdetails/suggestionCardWrapper";
import { Ratings } from "@/components/Ratings";
import { ProductDescription } from "@/components/category/productDesc";
import ProductMediaGallery from "@/components/ProductMediaGallery";


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
async function fetchProduct(productId: string): Promise<WooProduct> {
  if (!productId) throw new Error("Missing product id");
  const base = process.env.WC_API_BASE ?? "https://atlaze.com/wp-json/wc/v3";
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("Missing WC consumer key/secret env variables");

  const url = `${base}/products/${encodeURIComponent(productId)}?consumer_key=${encodeURIComponent(
    key
  )}&consumer_secret=${encodeURIComponent(secret)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // ISR 1 hour
  if (res.status === 404) throw new Error("Not found");
  if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
  const data = (await res.json()) as WooProduct;
  return data;
}

/* -------------------------
   Metadata (dynamic)
   ------------------------- */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const product = await fetchProduct(params.id);

    const title = product.name ? `${product.name}` : "Product | Atlaze";
    const description = product.short_description || product.description || "Product on Atlaze";
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
export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id;

  let product: WooProduct | null = null;
  try {
    product = await fetchProduct(id);
  } catch (err) {
    // If fetch fails, show 404 page to Next
    console.error("product fetch error:", err);
    notFound();
  }

  // At this point product is guaranteed non-null
  const image = product!.images?.[0]?.src ?? null;

  return (
    <main className="container w-full mx-auto md:max-w-[95%] lg:max-w-full xl:max-w-[1300px] 2xl:max-w-[1440px] font-poppins px-4 py-8">
      {/* Breadcrumb — keep semantic & crawlable links */}
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap gap-x-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/category?cat=${product?.categories[0]?.id}`}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {product?.categories[0]?.name
                ?.replace("&amp;", "")
                ?.toLowerCase()}
            </Link>
          </li>
          <li>/</li>
          <li aria-current="page" className="text-gray-500">
            Product Details
          </li>
        </ol>
      </nav>

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
        <section className="flex-1">
          <Suspense fallback={<HeaderSkeleton />}>
            <ProductHeader product={product!} />
          </Suspense>

          <Suspense fallback={<SizeChartSkeleton />}>
            <SizeChart />
          </Suspense>

          <div className="mt-6 flex flex-col lg:flex-row lg:space-x-4">
            <button
              className="mt-4 w-full bg-[#660fcf] rounded-full text-white py-3 hover:bg-[#5300b8]"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
            <button
              className="mt-4 flex gap-3 items-center justify-center w-full border border-black text-black rounded-full py-3 hover:border-[#4c1292]"
              aria-label="Add to cart"
            >
              Favorite <FiHeart className="text-[20px]" />
            </button>
          </div>

          <Suspense fallback={<DescriptionSkeleton />}>
            <ProductDescription product={product!} />
          </Suspense>
        </section>
      </article>


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

function ProductHeader({ product }: { product: WooProduct }) {
  return (
    <header className="font-poppins">
      <h1 className="text-3xl font-bold" itemProp="name">
        {product.name}
      </h1>
      <p className="text-[15px] font-poppins text-[#7E7E7E]" aria-hidden>
        {/* Keep semantic category info if available; fallback */}
        {product?.categories[0]?.name?.replace("&amp;", "")?.toLowerCase()}
      </p>
      <div className="flex flex-row flex-nowrap items-start text-[14px] lg:gap-0.5">
        {product.rating_count}
        <Ratings rating={product.rating_count} />
      </div>
      <p
        className="text-[15px] mt-6 text-[#111111] font-semibold"
        itemProp="offers"
        itemScope
        itemType="http://schema.org/Offer"
      >
        NGN{product.price}
      </p>
    </header>
  );
}

function ImageGallery({ product }: { product: WooProduct }) {
  const images = product.images ?? [];
  const [first = { src: null }, second = { src: null }, third = { src: null }] = images;

  // If external image domains are blocked by next.config.js, images will break.
  // Make sure to add the domain(s) to next.config.js images.domains
  return (
    <div className="space-y-4">
      <div className="w-full relative min-h-[50vh] lg:min-h-[70vh] flex items-center justify-center">
        {first.src ? (
          <ProductImageZoomWrapper
            src={first.src}
            alt={first.alt ?? `${product.name} image`}
            gallery={images.slice(0, 6)}
          />
        ) : (
          <div className="h-48 w-full bg-gray-100 rounded-md flex items-center justify-center">
            No image
          </div>
        )}
      </div>
    </div>
  );
}

function SizeChart() {
  // If product carries size attributes in the future, parse them here.
  return (
    <section className="mt-4" aria-labelledby="sizechart-title">
      <h2 id="sizechart-title" className="text-sm font-semibold">
        UK Only sizes of applicable (UK 6 — EU 40)
      </h2>
      <table className="w-full text-sm mt-2 border-collapse" role="table" aria-label="Size chart">
        <thead>
          <tr>
            <th className="border p-2 text-left">Size</th>
            <th className="border p-2 text-left">UK</th>
            <th className="border p-2 text-left">EU</th>
            <th className="border p-2 text-left">US</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">UK 6</td>
            <td className="border p-2">UK 6</td>
            <td className="border p-2">EU 40</td>
            <td className="border p-2">US 7</td>
          </tr>
          <tr>
            <td className="border p-2">UK 7</td>
            <td className="border p-2">UK 7</td>
            <td className="border p-2">EU 41</td>
            <td className="border p-2">US 8</td>
          </tr>
          {/* Add other rows as needed */}
        </tbody>
      </table>
    </section>
  );
}

// -------------------------
// Product Suggestions (server component)
// -------------------------
async function ProductSuggestion({ relatedIds }: { relatedIds?: number[] }) {
  if (!relatedIds || relatedIds.length === 0) return null;

  const base = process.env.WC_API_BASE ?? "https://atlaze.com/wp-json/wc/v3";
  const key = process.env.WC_CONSUMER_KEY!;
  const secret = process.env.WC_CONSUMER_SECRET!;

  // Fetch all related products in parallel
  const productPromises = relatedIds.map(async (id) => {
    const res = await fetch(
      `${base}/products/${id}?consumer_key=${key}&consumer_secret=${secret}`,
      { next: { revalidate: 3600 } }
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
      aria-labelledby="suggestion-title"
      className="w-full h-auto font-display mt-10"
    >
      <h2 id="suggestion-title" className="text-gray-900 py-3">
        YOU MAY ALSO LIKE
      </h2>

      <SuggestionCardWrapper suggestions={suggestions} />
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

