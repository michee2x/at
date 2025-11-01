"use client"

import { WooProduct } from "@/types";

export function ProductDescription({ product, shorten = false }: { product: WooProduct, shorten?:boolean }) {
  return (
    <section className="mt-8" itemProp="description">
      <h2 className="text-xl font-semibold">Details</h2>
      <div className="mt-2 prose max-w-none">
        {/* short_description often contains HTML; if so, it's safer to sanitize.
            Here we simply render as HTML. If product.short_description is untrusted,
            sanitize before using dangerouslySetInnerHTML. */}
        {product.short_description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: shorten
                ? `${product.short_description.slice(0, 401)}...`
                : product.short_description,
            }}
          />
        ) : product.description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: shorten
                ? `${product.description.slice(0, 401)}...`
                : product.description,
            }}
          />
        ) : (
          <p>No description available.</p>
        )}
      </div>

      {/* <p className="mt-4">Colour Shown: Fleet/...</p>
      <p>Style: DV7421-001</p>
      <p className="mt-4">Declaration of Importer: Direct import by the individual customer</p>
      <p>Marketed by: Nike Global Trading B.V. Singapore Branch</p> */}
    </section>
  );
}