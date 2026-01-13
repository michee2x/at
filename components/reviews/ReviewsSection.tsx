"use client";

import React, { useState } from "react";
import { WooProductReview } from "@/types";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";

interface ReviewsSectionProps {
  initialReviews: WooProductReview[];
  productId: number;
  productSlug?: string;
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export function ReviewsSection({ initialReviews, productId, productSlug, user }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<WooProductReview[]>(initialReviews);

  const handleReviewSuccess = (newReview: WooProductReview) => {
    // Add new review to the top of the list
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <section className="mt-12 w-full max-w-[800px]">
        <h2 className="text-2xl font-bold font-display text-gray-900 mb-8">
            Customer Reviews ({reviews.length})
        </h2>

        {/* Existing Reviews */}
        <div className="mb-12">
            <ReviewList reviews={reviews} />
        </div>

        {/* Divider */}
        <hr className="border-gray-100 my-10" />

        {/* Write Review Form */}
        <div className="bg-white">
            <ReviewForm productId={productId} productSlug={productSlug} onSuccess={handleReviewSuccess} user={user} />
        </div>
    </section>
  );
}
