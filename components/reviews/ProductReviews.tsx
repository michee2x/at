import React from "react";
import { fetchProductReviews } from "@/lib/product-service";
import { ReviewsSection } from "./ReviewsSection";

interface ProductReviewsProps {
  productId: number;
  productSlug?: string;
}

import { getSession } from "@/lib/auth";

export async function ProductReviews({ productId, productSlug }: ProductReviewsProps) {
  const reviews = await fetchProductReviews(productId);
  const session = await getSession();

  return <ReviewsSection initialReviews={reviews} productId={productId} productSlug={productSlug} user={session?.user} />;
}
