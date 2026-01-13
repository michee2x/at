"use client";

import { cn } from "@/lib/utils";
import { WooProduct } from "@/types";
import truncate from "truncate-html";

interface ProductDescriptionProps {
  product: WooProduct;
  shorten?: boolean;
  title?: string;
  showTitle?: boolean;
  sliceLength?: number;
  className?: string;
}

export function ProductDescription({
  product,
  shorten = false,
  title = "Details",
  showTitle = true,
  sliceLength = 401,
  className,
}: ProductDescriptionProps) {
  // Choose which description to use
  const rawDescription = product.short_description || product.description || "";

  // Truncate HTML safely if shorten is true
  const content = shorten
    ? truncate(rawDescription, sliceLength, { ellipsis: "..." })
    : rawDescription;

  return (
    <section
      className={cn("mt-8 lg:pt-10 px-2 p-5", className)}
      itemProp="description"
    >
      {showTitle && (
        <h2 className="lg:text-3xl text-xl mb-6 font-semibold">{title}</h2>
      )}
      <div className="mt-2 prose max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-[1.8] prose-a:text-[#6A00EF] prose-strong:text-gray-900 font-poppins">
        {content ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        ) : (
          <p>No description available.</p>
        )}
      </div>
    </section>
  );
}
