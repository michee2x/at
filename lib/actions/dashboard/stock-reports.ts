"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

interface StockStats {
    totals: {
        lowstock: number;
        instock: number;
        outofstock: number;
        onbackorder: number;
        products: number;
    };
}

export interface StockProduct {
    id: number;
    parent_id: number;
    name: string;
    sku: string;
    stock_status: string;
    stock_quantity: number;
    manage_stock: boolean;
    low_stock_amount: number;
}

export async function getStockStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const params = new URLSearchParams();
    params.append("fields[0]", "products");
    params.append("fields[1]", "outofstock");
    params.append("fields[2]", "lowstock");
    params.append("fields[3]", "instock");
    params.append("fields[4]", "onbackorder");
    params.append("_locale", "user");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/stock/stats?${params}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Stock stats API error:", await response.text());
        return { totals: { lowstock: 0, instock: 0, outofstock: 0, onbackorder: 0, products: 0 } };
    }

    const data: StockStats = await response.json();
    return data;
}

export async function getStockProducts(type: string = "all", page: number = 1, perPage: number = 25) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/wc-analytics/reports/stock?orderby=stock_status&order=asc&page=${page}&per_page=${perPage}&type=${type}&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Stock products API error:", await response.text());
        return [];
    }

    const data: StockProduct[] = await response.json();
    return data;
}
