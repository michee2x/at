"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";
import { StoreSeoFormValues, SeoApiItem } from "@/lib/schemas/store-seo";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

const SEO_FIELDS_MAP: Record<string, keyof StoreSeoFormValues> = {
    "dokan-seo-meta-title": "metaTitle",
    "dokan-seo-meta-desc": "metaDesc",
    "dokan-seo-meta-keywords": "metaKeywords",
    "dokan-seo-og-title": "ogTitle",
    "dokan-seo-og-desc": "ogDesc",
    "dokan-seo-twitter-title": "twitterTitle",
    "dokan-seo-twitter-desc": "twitterDesc",
};

// Image fields need special handling for ID vs URL
const IMAGE_FIELDS_MAP: Record<string, { url: keyof StoreSeoFormValues; id: keyof StoreSeoFormValues }> = {
    "dokan-seo-og-image": { url: "ogImage", id: "ogImageId" },
    "dokan-seo-twitter-image": { url: "twitterImage", id: "twitterImageId" },
};

export async function getStoreSeoSettings() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return { success: false, message: "No token found" };

    try {
        const response = await fetch(`${WC_API_URL}/wp-json/dokan/v2/settings/store_seo?_locale=user`, {
            headers: {
                Authorization: `Bearer ${wpToken}`,
            },
            next: { tags: ["store-seo"] },
            cache: "no-store",
        });

        if (!response.ok) {
            return { success: false, message: "Failed to fetch SEO settings" };
        }

        const data: any[] = await response.json();
        console.log("this is the seo res from action: ", data)

        // Transform API array to form object
        const formValues: Partial<StoreSeoFormValues> = {};

        data.forEach((item) => {
            const fieldName = SEO_FIELDS_MAP[item.id];
            if (fieldName) {
                formValues[fieldName] = item.value || "";
            }

            const imageField = IMAGE_FIELDS_MAP[item.id];
            if (imageField) {
                // API returns value as ID for images, but we might want to fetch the URL if possible,
                // or the client component might need to handle fetching the image URL if only ID is provided.
                // However, the provided user example shows `value` being the ID.
                // The `MediaUpload` component needs a URL to display preview.
                // The API response in user request shows: "value": null, "url": false.
                // If "url" is present in response, we use it? The user's example response has "url": false.
                // Let's assume for now we only get ID or maybe we can't easily get the URL without another fetch.
                // BUT, looking closely at the user provided response:
                // { ... "id": "dokan-seo-og-image", "value": null, "url": false ... }
                // It seems `url` property might hold the URL if `value` (ID) is set.

                formValues[imageField.id] = item.value;
                // checks if url is present and not false
                if (item.url) {
                    formValues[imageField.url] = item.url;
                }
            }
        });

        return { success: true, data: formValues };
    } catch (error) {
        console.error("Error fetching SEO settings:", error);
        return { success: false, message: "Error fetching settings" };
    }
}

export async function updateStoreSeoSettings(data: StoreSeoFormValues) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Unauthorized" };

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) return { success: false, message: "No token found" };

    // Transform form object back to API array
    const apiPayload: SeoApiItem[] = [];

    // Text fields
    Object.entries(SEO_FIELDS_MAP).forEach(([apiId, formKey]) => {
        if (data[formKey] !== undefined) {
            apiPayload.push({
                id: apiId,
                value: data[formKey] || ""
            });
        }
    });

    // Image fields
    Object.entries(IMAGE_FIELDS_MAP).forEach(([apiId, keys]) => {
        // We send the ID
        if (data[keys.id] !== undefined) {
            apiPayload.push({
                id: apiId,
                value: data[keys.id] || null
            });
        }
    });

    try {
        const response = await fetch(`${WC_API_URL}/wp-json/dokan/v2/settings/store_seo?_locale=user`, {
            method: "PUT", // User said PUT or POST, PUT is safer for updates usually
            headers: {
                Authorization: `Bearer ${wpToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: apiPayload }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("SEO Update Failed:", result);
            return { success: false, message: result.message || "Failed to update SEO settings" };
        }

        console.log("\n\n\n\n\n\n seo updates sucessful: ", result, "payload: ", apiPayload)

        revalidatePath("/dashboard/settings/seo");
        return { success: true, message: "SEO settings updated successfully" };
    } catch (error) {
        console.error("Error updating SEO settings:", error);
        return { success: false, message: "Error updating settings" };
    }
}
