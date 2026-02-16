"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface Review {
    id: number;
    date_created: string;
    review: string;
    rating: number;
    name: string;
    email: string;
    verified: boolean;
    link: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    totalCount: number;
    totalPages: number;
}

export async function getReviews(status: string = "approved", page: number = 1, per_page: number = 10): Promise<ReviewsResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    let statusParam = status;
    // Map UI status to API status if needed (e.g. "Pending" -> "hold")
    if (status === "pending") statusParam = "hold";

    const url = `${WC_API_URL}/wp-json/dokan/v1/reviews?per_page=${per_page}&pagenum=${page}&status=${statusParam}&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Reviews API error:", await response.text());
        return { reviews: [], totalCount: 0, totalPages: 0 };
    }

    const reviews: Review[] = await response.json();
    const totalCount = parseInt(response.headers.get("x-wp-total") || "0");
    const totalPages = parseInt(response.headers.get("x-wp-totalpages") || "0");

    return { reviews, totalCount, totalPages };
}
