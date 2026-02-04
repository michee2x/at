"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://atlaze.com";

export interface CategoryReport {
    category_id: number;
    items_sold: number;
    net_revenue: number;
    orders_count: number;
    products_count: number;
    extended_info: {
        name: string;
    };
}

export interface CategoryProductReport {
    product_id: number;
    items_sold: number;
    net_revenue: number;
    orders_count: number;
    extended_info: {
        name: string;
        sku: string;
        stock_status: string;
        price: number;
    };
}

export async function getCategoriesReport(after: string, before: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/categories?orderby=items_sold&order=desc&after=${encodeURIComponent(after)}&before=${encodeURIComponent(before)}&page=1&per_page=25&extended_info=true&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Categories API error:", await response.text());
        return [];
    }

    const data: CategoryReport[] = await response.json();
    return data;
}

export async function getCategoryProducts(categoryId: number, after: string, before: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/products?orderby=items_sold&order=desc&after=${encodeURIComponent(after)}&before=${encodeURIComponent(before)}&page=1&per_page=25&categories=${categoryId}&extended_info=true&segmentby=product&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Category Products API error:", await response.text());
        return [];
    }

    const data: CategoryProductReport[] = await response.json();
    return data;
}

export async function getCategoryStats(categoryId: number, after: string, before: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const params = new URLSearchParams({
        order: "asc",
        interval: "day",
        per_page: "100",
        after,
        before,
        segmentby: "product",
        categories: categoryId.toString(),
        "_locale": "user"
    });
    params.append("fields[0]", "products_count");
    params.append("fields[1]", "items_sold");
    params.append("fields[2]", "net_revenue");
    params.append("fields[3]", "orders_count");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/products/stats?${params}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Category Stats API error:", await response.text());
        return null;
    }

    return await response.json();
}
