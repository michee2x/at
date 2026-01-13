import { QueryParams, WooProduct, WooProductReview, ReviewData } from "@/types";

interface WCProductResponse<T = unknown> {
    products: T[];
    total: number;
    totalPages: number;
}

// -----------------------------
// Shared helper to map params → REST API format
// -----------------------------
export function buildQueryParams(params: QueryParams): Record<string, string> {
    const query: Record<string, string> = {};

    if (params.category) query["category"] = String(params.category);
    if (params.page) query["page"] = String(params.page);
    query["per_page"] = params.per_page ? String(params.per_page) : "12";

    if (params.min_price) query["min_price"] = String(params.min_price);
    if (params.max_price) query["max_price"] = String(params.max_price);

    // Stock Status: handle both 'in_stock' (legacy/boolean) and 'stock_status' (string from UI)
    if (params.stock_status) {
        query["stock_status"] = String(params.stock_status);
    } else if (params.in_stock !== undefined) {
        query["stock_status"] = params.in_stock === "true" || params.in_stock === true ? "instock" : "outofstock";
    }

    if (params.q) query["search"] = String(params.q);
    if (params.brand_id) query["brand"] = String(params.brand_id);

    // Rating filter (minimum rating)
    if (params.rating) query["min_rating"] = String(params.rating);

    // On sale filter
    if (params.on_sale === "true" || params.on_sale === true) query["on_sale"] = "true";

    // Featured products filter
    if (params.featured === "true" || params.featured === true) query["featured"] = "true";

    // Handle attribute filters (attr_color=Gold)
    for (const key of Object.keys(params)) {
        if (key.startsWith("attr_")) {
            const attr = key.replace("attr_", "");
            query["attribute"] = attr;
            query["attribute_term"] = String(params[key]);
        }
    }


    // Sorting
    // Normalize sort input: check params.sort first, then params.orderby
    const sortValue = params.sort || params.orderby;

    switch (sortValue) {
        case "price_asc":
        case "price": // UI sends "price" for Low to High
            query["orderby"] = "price";
            query["order"] = "asc";
            break;
        case "price_desc":
            query["orderby"] = "price";
            query["order"] = "desc";
            break;
        case "latest":
        case "date": // UI sends "date"
            query["orderby"] = "date";
            query["order"] = "desc";
            break;
        case "rating":
            query["orderby"] = "rating";
            query["order"] = "desc";
            break;
        case "popularity":
            query["orderby"] = "popularity";
            query["order"] = "desc";
            break;
        default:
            query["orderby"] = "popularity";
    }


    // Banner-specific filters
    if (params.on_sale === "true") query["on_sale"] = "true";

    if (params.product_type) query["type"] = String(params.product_type);

    if (params.featured === "true") query["featured"] = "true";

    if (params.banner === "best-sellers") {
        query["orderby"] = "popularity";
        query["order"] = "desc";
    }

    if (params.banner === "new-arrivals") {
        query["orderby"] = "date";
        query["order"] = "desc";
        // Optional: filter by date range
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query["after"] = thirtyDaysAgo.toISOString();
    }

    return query;
}

// -----------------------------
// Fetch WooCommerce products
// -----------------------------
export async function fetchWCProducts<T = WooProduct>(params: QueryParams): Promise<WCProductResponse<T>> {
    const base = process.env.WC_BASE_URL! || "https://atlaze.com";
    const key = process.env.WC_CONSUMER_KEY!;
    const secret = process.env.WC_CONSUMER_SECRET!;

    const query = buildQueryParams(params);
    const url = new URL("/wp-json/wc/v3/products", base);

    Object.entries({ ...query, consumer_key: key, consumer_secret: secret }).forEach(
        ([k, v]) => url.searchParams.set(k, v)
    );

    console.log("Fetching WC Products from:", url.toString());

    const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!res.ok) throw new Error(`WooCommerce fetch failed (${res.status})`);
    const data = (await res.json()) as T[];

    return {
        products: data,
        total: Number(res.headers.get("X-WP-Total") ?? 0),
        totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
    };
}

// -----------------------------
// Fetch Dokan vendor products
// -----------------------------
export async function fetchDokanProducts<T = WooProduct>(params: QueryParams): Promise<WCProductResponse<T>> {
    const base = process.env.WC_BASE_URL! || "https://atlaze.com";

    // Logic to handle vendor/store ID mapping
    // If 'vendor' param is present, use it as store ID if 'store' is missing
    let store = params.store;
    if (!store && params["vendor"]) {
        store = params["vendor"] as string;
    }

    if (!store) throw new Error("Missing store ID for Dokan fetch");

    const query = buildQueryParams(params);
    // Remove vendor/store from query params as it's in the URL path
    delete query.store;
    delete query.vendor;

    const url = new URL(`/wp-json/dokan/v1/stores/${store}/products`, base);
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

    console.log("Fetching Dokan Products from:", url.toString());

    const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!res.ok) throw new Error(`Dokan fetch failed (${res.status})`);
    const data = (await res.json()) as T[];

    return {
        products: data,
        total: Array.isArray(data) ? data.length : 0,
        totalPages: 1, // Dokan API pagination handling might differ, basic support here
    };
}

// -----------------------------
// Product Reviews
// -----------------------------
export async function fetchProductReviews(productId: number): Promise<WooProductReview[]> {
    const base = process.env.WC_BASE_URL || "https://atlaze.com";
    const key = process.env.WC_CONSUMER_KEY!;
    const secret = process.env.WC_CONSUMER_SECRET!;

    const url = new URL("/wp-json/wc/v3/products/reviews", base);
    url.searchParams.set("product", String(productId));
    url.searchParams.set("consumer_key", key);
    url.searchParams.set("consumer_secret", secret);

    const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 } 
    });

    if (!res.ok) {
        console.error("Failed to fetch reviews", await res.text());
        return [];
    }
    
    return res.json() as Promise<WooProductReview[]>;
}

export async function createProductReview(data: ReviewData): Promise<WooProductReview> {
    const base = process.env.WC_BASE_URL || "https://atlaze.com";
    const key = process.env.WC_CONSUMER_KEY!;
    const secret = process.env.WC_CONSUMER_SECRET!;

    const url = new URL("/wp-json/wc/v3/products/reviews", base);
    url.searchParams.set("consumer_key", key);
    url.searchParams.set("consumer_secret", secret);

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create review:", res.status, errorText);
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || "Failed to submit review");
        } catch (e) {
            throw new Error(`Failed to submit review: ${res.statusText}`);
        }
    }

    return res.json() as Promise<WooProductReview>;
}
