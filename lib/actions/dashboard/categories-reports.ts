"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

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

export async function getCategoryStats(categoryIds: number[], after: string, before: string) {
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
        categories: categoryIds.join(","),
        "_locale": "user"
    });
    // Note: User provided URL didn't have segmentby=product for comparison, 
    // but did for single category. We might need to handle both cases or 
    // separate them. The user's comparison URL specifically lacked segmentby 
    // and just had categories=83,82.
    // However, for single category we DO need segmentby=product to see product breakdown if we wanted that?
    // Actually the previous step used getCategoryStats for single category too. 
    // Let's check the previous implementation of getCategoryStats. 
    // It had segmentby: "product".
    // The user's new URL for comparison DOES NOT have segmentby.
    // So I should make segmentby optional or conditional.

    if (categoryIds.length === 1) {
        params.append("segmentby", "product");
    }

    params.append("fields[0]", "items_sold");
    params.append("fields[1]", "net_revenue");
    params.append("fields[2]", "orders_count");
    // Removed products_count as it wasn't in the comparison example, but probably harmless to keep.
    // User example: fields[0]=items_sold, fields[1]=net_revenue, fields[2]=orders_count

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
