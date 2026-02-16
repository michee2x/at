import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";
import qs from "querystring";

const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "20";
    const parent = searchParams.get("parent"); 

    try {
        // Use WooCommerce V3 API which is standard for products
        // Authenticate with Admin Keys to ensure we can read all categories
        const query: any = {
            consumer_key: WC_KEY,
            consumer_secret: WC_SECRET,
            page,
            per_page,
            hide_empty: false, // Show all
            exclude: [15], // Exclude 'Uncategorized' if ID 15
        };

        if (search) {
            query.search = search;
        }

        if (parent) {
            query.parent = parent;
        }

        const queryString = qs.stringify(query);
        const url = `${WP_URL}/wp-json/wc/v3/products/categories?${queryString}`;
        console.log("[API] Fetching categories from:", url);

        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[API] Fetch Categories Error:", res.status, errorText);
            return new NextResponse(`WC API Error: ${errorText}`, { status: res.status });
        }

        const categories = await res.json();
        console.log(`[API] Found ${categories.length} categories`);
        
        // WC V3 returns X-WP-Total in headers
        const total = res.headers.get("x-wp-total");
        const totalPages = res.headers.get("x-wp-totalpages");

        return NextResponse.json({
            data: categories,
            meta: {
                total: total ? parseInt(total) : 0,
                totalPages: totalPages ? parseInt(totalPages) : 0,
                page: parseInt(page),
            }
        });

    } catch (error) {
        console.error("[API] Error fetching categories:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
