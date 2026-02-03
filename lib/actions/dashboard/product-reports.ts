"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://atlaze.com";

interface StatsResponse {
    totals: {
        items_sold: number;
        net_revenue: number;
        orders_count: number;
    };
}

interface ChartInterval {
    interval: string;
    subtotals: {
        items_sold: number;
    };
}

interface ChartResponse {
    intervals: ChartInterval[];
}

export async function getProductStats(after: string, before: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const params = new URLSearchParams({
        after,
        before,
    });

    params.append("fields[]", "items_sold");
    params.append("fields[]", "net_revenue");
    params.append("fields[]", "orders_count");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/products/stats?${params}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Stats API error:", await response.text());
        return { items_sold: 0, net_revenue: 0, orders_count: 0 };
    }

    const data: StatsResponse = await response.json();
    return data.totals;
}

export async function getChartData(after: string, before: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const params = new URLSearchParams({
        interval: "day",
        after,
        before,
    });
    
    params.append("fields[]", "items_sold");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/products/stats?${params}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Chart API error:", await response.text());
        return [];
    }

    const data: ChartResponse = await response.json();
    return data.intervals.map(interval => ({
        date: interval.interval,
        items: interval.subtotals.items_sold,
    }));
}

export async function getProductsReport() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v1/products?per_page=10&page=1`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Products API error:", await response.text());
        return [];
    }

    const data = await response.json();
    return data.map((product: any) => ({
        id: product.id,
        title: product.name,
        sku: product.sku || "-",
        items_sold: product.total_sales || 0,
        net_sales: product.price || "0",
    }));
}
