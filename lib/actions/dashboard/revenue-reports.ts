"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

interface RevenueResponse {
    totals: {
        orders_count: number;
        gross_sales: number;
        total_sales: number;
        refunds: number;
        coupons: number;
        taxes: number;
        shipping: number;
        net_revenue: number;
    };
    intervals: Array<{
        interval: string;
        subtotals: {
            orders_count: number;
            gross_sales: number;
            total_sales: number;
            refunds: number;
            coupons: number;
            taxes: number;
            shipping: number;
            net_revenue: number;
        };
    }>;
}

export async function getRevenueStats(after: string, before: string) {
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
        "fields[0]": "orders_count",
        "fields[1]": "gross_sales",
        "fields[2]": "total_sales",
        "fields[3]": "refunds",
        "fields[4]": "coupons",
        "fields[5]": "taxes",
        "fields[6]": "shipping",
        "fields[7]": "net_revenue",
        "_locale": "user",
    });

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/revenue/stats?${params}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Revenue API error:", await response.text());
        return {
            totals: {
                orders_count: 0,
                gross_sales: 0,
                total_sales: 0,
                refunds: 0,
                coupons: 0,
                taxes: 0,
                shipping: 0,
                net_revenue: 0,
            },
            intervals: [],
            chartData: [],
        };
    }

    const data: RevenueResponse = await response.json();

    return {
        totals: data.totals,
        intervals: data.intervals.map(interval => ({
            interval: interval.interval,
            orders_count: interval.subtotals.orders_count,
            gross_sales: interval.subtotals.gross_sales,
            refunds: interval.subtotals.refunds || 0,
            coupons: interval.subtotals.coupons || 0,
            net_revenue: interval.subtotals.net_revenue,
            taxes: interval.subtotals.taxes || 0,
            shipping: interval.subtotals.shipping || 0,
            total_sales: interval.subtotals.total_sales,
        })),
        chartData: data.intervals.map(interval => ({
            date: interval.interval,
            gross_sales: interval.subtotals.gross_sales,
        })),
    };
}
