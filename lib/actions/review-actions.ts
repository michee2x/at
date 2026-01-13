"use server";

import { createProductReview } from "@/lib/product-service";
import { ReviewData, WooProductReview } from "@/types";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(data: ReviewData & { productSlug?: string }): Promise<WooProductReview> {
    const review = await createProductReview(data);

    // Revalidate the product page to show the new review (if approved immediately)
    // or just to refresh state. 
    if (data.productSlug) {
        revalidatePath(`/product/${data.productSlug}`);
    } else {
        revalidatePath(`/product/${data.product_id}`);
    }

    return review;
}
