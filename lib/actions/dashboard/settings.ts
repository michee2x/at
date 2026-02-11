"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { storeSettingsUpdateSchema, type StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { revalidateTag } from "next/cache";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface SocialLinks {
    fb?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    flickr?: string;
    threads?: string;
}

export interface WarrantySettings {
    label?: string;
    type?: "no_warranty" | "included_warranty" | "addon_warranty";
    policy?: string;
}

export interface FullStoreData {
    id?: number;
    store_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    social?: SocialLinks;
    phone?: string;
    show_email?: boolean;
    address?: any;
    location?: string;
    banner?: string;
    banner_id?: number;
    gravatar?: string;
    gravatar_id?: number;
    shop_url?: string;
    toc_enabled?: boolean;
    store_toc?: string;
    company_name?: string;
    vat_number?: string;
    company_id_number?: string;
    bank_name?: string;
    bank_iban?: string;
    vendor_biography?: string;
    warranties?: WarrantySettings;
    [key: string]: any; // For other fields from API
}

export interface StoreSettingsResponse {
    success: boolean;
    data?: FullStoreData;
    social?: SocialLinks;
    warranties?: WarrantySettings;
    message?: string;
}

/**
 * Fetches the current store settings (full store data)
 */
export async function getStoreSettings(): Promise<StoreSettingsResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    const userId = (session as any)?.user?.id;

    if (!wpToken || !userId) return { success: false, message: "No token or user ID" };

    const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${userId}?_locale=user`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${wpToken}`,
            },
            next: { tags: ['store-settings'] }
        });

        if (!response.ok) return { success: false, message: "Failed to fetch settings" };

        const data: FullStoreData = await response.json();

        // Return full store data
        return {
            success: true,
            data,
            social: data.social || {},
            warranties: data.warranties || {}
        };
    } catch (error) {
        console.error("Error fetching store settings:", error);
        return { success: false, message: "Error fetching settings" };
    }
}

/**
 * Updates the store settings with validation and sanitization
 */
export async function updateStoreSettings(settingsData: StoreSettingsUpdate): Promise<StoreSettingsResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    const userId = (session as any)?.user?.id;

    if (!wpToken || !userId) return { success: false, message: "No token or user ID" };

    // Validate and sanitize input using Zod
    const validation = storeSettingsUpdateSchema.safeParse(settingsData);

    if (!validation.success) {
        const errors = validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return { success: false, message: `Validation error: ${errors}` };
    }

    const sanitizedData = validation.data;
    const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${userId}?_locale=user`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedData),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to update settings"
            };
        }

        // Revalidate cache
        revalidateTag('store-settings');

        return {
            success: true,
            message: "Store settings updated successfully",
            data: result
        };
    } catch (error) {
        console.error("Error updating store settings:", error);
        return { success: false, message: "Update error" };
    }
}

/**
 * Updates the store social settings
 */
export async function updateSocialSettings(socialData: SocialLinks): Promise<StoreSettingsResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    const userId = (session as any)?.user?.id;

    if (!wpToken || !userId) return { success: false, message: "No token or user ID" };

    const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${userId}?_locale=user`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                social: socialData
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to update settings"
            };
        }

        return { success: true, message: "Settings saved successfully", social: result.social };
    } catch (error) {
        console.error("Error updating store settings:", error);
        return { success: false, message: "Update error" };
    }
}

/**
 * Updates the store RMA/Warranty settings
 */
export async function updateStoreRmaSettings(rmaData: WarrantySettings): Promise<StoreSettingsResponse> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    const userId = (session as any)?.user?.id;

    if (!wpToken || !userId) return { success: false, message: "No token or user ID" };

    const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${userId}?_locale=user`;

    try {
        const payload = {
            // format 1: nested
            warranties: rmaData,

            // format 2: flat keys (common in some versions)
            warranty_label: rmaData.label,
            warranty_type: rmaData.type,
            warranty_policy: rmaData.policy,

            // format 3: store prefixed
            store_warranty_label: rmaData.label,
            store_warranty_type: rmaData.type,
            store_warranty_policy: rmaData.policy
        };

        console.log("SENDING SHOTGUN PAYLOAD:", JSON.stringify(payload, null, 2));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("RMA UPDATE RESPONSE:", JSON.stringify(result, null, 2));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to update settings"
            };
        }

        return { success: true, message: "Settings saved successfully", warranties: result.warranties };
    } catch (error) {
        console.error("Error updating RMA settings:", error);
        return { success: false, message: "Update error" };
    }
}
