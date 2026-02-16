"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

export interface VendorProfile {
    id: number;
    store_name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    social?: {
        fb?: string;
        instagram?: string;
        twitter?: string;
        pinterest?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
        flickr?: string;
        threads?: string;
    };
    phone?: string;
    show_email?: boolean;
    address?: any;
    location?: string;
    banner?: string;
    gravatar?: string;
    shop_url?: string;
    vendor_biography?: string;
    rating?: {
        rating: number;
        count: number;
    };
}

export interface VendorProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    price: string;
    regular_price: string;
    sale_price: string;
    images: Array<{
        id: number;
        src: string;
        name: string;
        alt: string;
    }>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export interface VendorReview {
    id: number;
    product_id: number;
    product_name: string;
    reviewer: string;
    reviewer_email: string;
    review: string;
    rating: number;
    verified: boolean;
    date_created: string;
}

/**
 * Fetch vendor profile by username
 * This is a public endpoint, no authentication required
 */
export async function getVendorByUsername(username: string) {
    try {
        // First, we need to search for the vendor by username/slug
        // The Dokan API typically uses /dokan/v1/stores endpoint
        const searchUrl = `${WC_API_URL}/wp-json/dokan/v1/stores?search=${encodeURIComponent(username)}`;
        
        const response = await fetch(searchUrl, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Error fetching vendor:", await response.text());
            return { success: false, message: "Vendor not found" };
        }

        const vendors = await response.json();
        console.log("this is the vendors: ", vendors)
        
        // Find exact match or first result
        const vendor = vendors.find((v: any) => 
            v.shop_url?.includes(username) || v.store_name?.toLowerCase() === username.toLowerCase()
        ) || vendors[0];

        if (!vendor) {
            return { success: false, message: "Vendor not found" };
        }

        return { success: true, data: vendor as VendorProfile };
    } catch (error) {
        console.error("Error fetching vendor by username:", error);
        return { success: false, message: "Error fetching vendor" };
    }
}

/**
 * Fetch vendor profile by ID
 */
export async function getVendorById(id: number) {
    try {
        const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${id}`;
        
        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Error fetching vendor:", await response.text());
            return { success: false, message: "Vendor not found" };
        }

        const vendor = await response.json();
        return { success: true, data: vendor as VendorProfile };
    } catch (error) {
        console.error("Error fetching vendor by ID:", error);
        return { success: false, message: "Error fetching vendor" };
    }
}

/**
 * Fetch products for a specific vendor
 */
export async function getVendorProducts(vendorId: number, page: number = 1, perPage: number = 12) {
    try {
        // Use Dokan endpoint which is more reliable for vendor-specific products
        const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${vendorId}/products?page=${page}&per_page=${perPage}`;
        
        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Error fetching vendor products:", await response.text());
            return { success: false, data: [], message: "Failed to fetch products" };
        }

        const products = await response.json();
        return { success: true, data: products as VendorProduct[] };
    } catch (error) {
        console.error("Error fetching vendor products:", error);
        return { success: false, data: [], message: "Error fetching products" };
    }
}

/**
 * Fetch reviews for a specific vendor
 */
export async function getVendorReviews(vendorId: number, page: number = 1, perPage: number = 10) {
    try {
        // WooCommerce reviews endpoint filtered by vendor
        const url = `${WC_API_URL}/wp-json/wc/v3/products/reviews?author=${vendorId}&page=${page}&per_page=${perPage}`;
        
        const authHeader = "Basic " + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");

        const response = await fetch(url, {
            headers: {
                "Authorization": authHeader
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Error fetching vendor reviews:", await response.text());
            return { success: false, data: [], message: "Failed to fetch reviews" };
        }

        const reviews = await response.json();
        return { success: true, data: reviews as VendorReview[] };
    } catch (error) {
        console.error("Error fetching vendor reviews:", error);
        return { success: false, data: [], message: "Error fetching reviews" };
    }
}

/**
 * Get product categories for a vendor
 */
export async function getVendorCategories(vendorId: number) {
    try {
        // Fetch vendor's products and extract unique categories
        const productsResult = await getVendorProducts(vendorId, 1, 100);
        
        if (!productsResult.success || !productsResult.data) {
            return { success: false, data: [] };
        }

        const categories = new Map();
        productsResult.data.forEach((product: VendorProduct) => {
            product.categories?.forEach(cat => {
                if (!categories.has(cat.id)) {
                    categories.set(cat.id, cat);
                }
            });
        });

        return { success: true, data: Array.from(categories.values()) };
    } catch (error) {
        console.error("Error fetching vendor categories:", error);
        return { success: false, data: [] };
    }
}
/**
 * Send a contact message to the vendor
 */
export async function sendVendorContactMessage(vendorId: number, data: { name: string; email: string; message: string }) {
    try {
        const url = `${WC_API_URL}/wp-json/dokan/v1/stores/${vendorId}/contact`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Error sending message to vendor:", errorData);
            return { success: false, message: errorData.message || "Failed to send message" };
        }

        const responseData = await response.json().catch(() => ({}));
        console.log("✅ API Response for Contact Vendor:", responseData);

        return { success: true, message: "Message sent successfully", data: responseData };
    } catch (error) {
        console.error("Error sending message to vendor:", error);
        return { success: false, message: "An error occurred while sending the message" };
    }
}
