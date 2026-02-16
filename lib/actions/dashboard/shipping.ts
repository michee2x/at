"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface ShippingPolicySettings {
    processing_time?: string;
    shipping_policy?: string;
    refund_policy?: string;
}

export interface ShippingPolicyResponse {
    success: boolean;
    data?: ShippingPolicySettings;
    message?: string;
}

/**
 * Fetches the current shipping policy settings
 */
export async function getShippingPolicy(): Promise<ShippingPolicyResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return { success: false, message: "No WordPress Token" };

    // The endpoint as requested: /dokan/v1/shipping/policy?_locale=user
    const url = `${WC_API_URL}/wp-json/dokan/v1/shipping/policy?_locale=user`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${wpToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Error fetching shipping policy:", await response.text());
            return { success: false, message: "Failed to fetch shipping policy" };
        }

        const data: ShippingPolicySettings = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error("Error fetching shipping policy:", error);
        return { success: false, message: "Error fetching shipping policy" };
    }
}

/**
 * Updates the shipping policy settings
 */
export async function updateShippingPolicy(data: ShippingPolicySettings): Promise<ShippingPolicyResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return { success: false, message: "No WordPress Token" };

    const url = `${WC_API_URL}/wp-json/dokan/v1/shipping/policy?_locale=user`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error updating shipping policy:", result);
            return { success: false, message: result.message || "Failed to update shipping policy" };
        }

        revalidatePath("/dashboard/settings/shipping");
        return { success: true, message: "Policy settings updated successfully" };

    } catch (error) {
        console.error("Error updating shipping policy:", error);
        return { success: false, message: "Error updating shipping policy" };
    }
}
