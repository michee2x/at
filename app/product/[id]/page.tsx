// /app/product/[id]/page.tsx
import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
type WooProductImage = { src?: string; alt?: string };
type WooProduct = {
  id: number;
  name?: string;
  short_description?: string | null;
  description?: string | null;
  price?: string | number;
  sku?: string;
  images?: WooProductImage[];
  // add more fields as needed...
};

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

    const title = product.name ? `${product.name} | Atlaze` : "Product | Atlaze";
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
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb — keep semantic & crawlable links */}
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap gap-x-2 text-sm">
          <li>
            <a href="/" className="text-blue-600 hover:underline">
              Home
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/category" className="text-blue-600 hover:underline">
              Category
            </a>
          </li>
          <li>/</li>
          <li aria-current="page" className="text-gray-500">
            {product!.name ?? "Product"}
          </li>
        </ol>
      </nav>

      <article
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        itemScope
        itemType="http://schema.org/Product"
      >
        {/* Left: Images */}
        <Suspense fallback={<ImageGallerySkeleton />}>
          <ImageGallery product={product!} />
        </Suspense>

        {/* Right: Info */}
        <section>
          <Suspense fallback={<HeaderSkeleton />}>
            <ProductHeader product={product!} />
          </Suspense>

          <Suspense fallback={<SizeChartSkeleton />}>
            <SizeChart />
          </Suspense>

          <button
            className="mt-4 w-full bg-[#6A00EF] text-white py-3 rounded-md hover:bg-[#4c1292]"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>

          <Suspense fallback={<DescriptionSkeleton />}>
            <ProductDescription product={product!} />
          </Suspense>
        </section>
      </article>

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
    <header>
      <h1 className="text-3xl font-bold" itemProp="name">
        {product.name}
      </h1>
      <p className="text-lg text-gray-600" aria-hidden>
        {/* Keep semantic category info if available; fallback */}
        Men&apos;s Shoe
      </p>
      <p className="text-2xl font-semibold mt-2" itemProp="offers" itemScope itemType="http://schema.org/Offer">
        ${product.price}
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
      <div className=" bg-red-400 w-full h-96 flex items-center justify-center">
        {first.src ? (
          <Image
            src={first.src}
            alt={first.alt ?? `${product.name} image`}
            width={600}
            height={400}
            className="object-cover rounded-md"
            priority
          />
        ) : (
          <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
            No image
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2">
        {third.src ? (
          <Image
            src={third.src}
            alt={third.alt ?? `${product.name} image`}
            width={1200}
            height={800}
            className="object-cover rounded-md"
            priority
          />
        ) : (
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            No image
          </div>
        )}
        {second.src ? (
          <Image
            src={second.src}
            alt={second.alt ?? `${product.name} image`}
            width={600}
            height={400}
            className="object-cover rounded-md"
            priority
          />
        ) : (
          <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
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

function ProductDescription({ product }: { product: WooProduct }) {
  return (
    <section className="mt-8" itemProp="description">
      <h2 className="text-xl font-semibold">Details</h2>
      <div className="mt-2 prose max-w-none">
        {/* short_description often contains HTML; if so, it's safer to sanitize.
            Here we simply render as HTML. If product.short_description is untrusted,
            sanitize before using dangerouslySetInnerHTML. */}
        {product.short_description ? (
          <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
        ) : product.description ? (
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        ) : (
          <p>No description available.</p>
        )}
      </div>

      <p className="mt-4">Colour Shown: Fleet/...</p>
      <p>Style: DV7421-001</p>
      <p className="mt-4">Declaration of Importer: Direct import by the individual customer</p>
      <p>Marketed by: Nike Global Trading B.V. Singapore Branch</p>
    </section>
  );
}

/* -------------------------
   Skeletons (client-safe simple placeholders)
   ------------------------- */

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
