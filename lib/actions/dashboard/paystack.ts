"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface PaystackBank {
    id: number;
    name: string;
    slug: string;
    code: string;
    active: boolean;
}

export interface ConnectPaystackResult {
    success: boolean;
    message?: string;
    error?: string;
    debug?: any; // Start returning raw response for debugging
}

export async function getPaystackBanks(): Promise<PaystackBank[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return [];

    const url = `${WC_API_URL}/wp-json/dokan/v1/paystack/banks?_locale=user`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${wpToken}`,
            },
            cache: "force-cache", // Banks list rarely changes, can cache
            next: { revalidate: 3600 }
        });

        if (!response.ok) return [];

        const result = await response.json();
        // The API returns { status: true, message: "...", data: [...] } based on user provided sample
        if (result.status && Array.isArray(result.data)) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching Paystack banks:", error);
        return [];
    }
}

export async function connectPaystackAccount(data: any): Promise<ConnectPaystackResult> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return { success: false, message: "No token" };

    const url = `${WC_API_URL}/wp-json/dokan/v1/paystack/connect?_locale=user`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (!response.ok || (result.code && result.code.includes("error"))) {
            // Handle specific Paystack error format
            return {
                success: false,
                message: result.message || "Failed to connect",
                error: result.data?.error || result.message
            };
        }

        return { success: true, message: "Connected successfully" };
    } catch (error) {
        console.error("Error connecting Paystack:", error);
        return { success: false, message: "Connection error occurred" };
    }
}
