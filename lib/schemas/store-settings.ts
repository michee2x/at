import { z } from "zod";

/**
 * Zod Schema for Store Settings
 * Provides validation and sanitization for all store-related fields
 */

// Helper function to sanitize HTML (basic XSS prevention)
const sanitizeHtml = (html: string): string => {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '');
};

// Social media links schema
export const socialLinksSchema = z.object({
    fb: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    pinterest: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
    flickr: z.string().url().optional().or(z.literal('')),
    threads: z.string().url().optional().or(z.literal('')),
}).optional();

// Address schema (flexible to accommodate different formats)
export const addressSchema = z.union([
    z.object({
        street_1: z.string().trim().max(200).optional(),
        street_2: z.string().trim().max(200).optional(),
        city: z.string().trim().max(100).optional(),
        zip: z.string().trim().max(20).optional(),
        country: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
    }),
    z.array(z.any()),
    z.any(),
]).optional();

// Main store settings schema
export const storeSettingsSchema = z.object({
    // Basic Information
    store_name: z
        .string()
        .trim()
        .min(2, "Store name must be at least 2 characters")
        .max(100, "Store name must not exceed 100 characters"),

    phone: z
        .string()
        .trim()
        .max(20)
        .regex(/^[+\-\s\d()]*$/, "Phone number contains invalid characters")
        .optional()
        .or(z.literal('')),

    // Images
    banner: z.string().url().optional().or(z.literal('')),
    banner_id: z.number().optional(),
    gravatar: z.string().url().optional().or(z.literal('')),
    gravatar_id: z.number().optional(),

    // Address
    address: addressSchema,

    // Company & Financial Information
    company_name: z
        .string()
        .trim()
        .max(200, "Company name must not exceed 200 characters")
        .optional()
        .or(z.literal('')),

    company_id_number: z
        .string()
        .trim()
        .max(100, "Company ID must not exceed 100 characters")
        .optional()
        .or(z.literal('')),

    vat_number: z
        .string()
        .trim()
        .max(50, "VAT number must not exceed 50 characters")
        .optional()
        .or(z.literal('')),

    bank_name: z
        .string()
        .trim()
        .max(200, "Bank name must not exceed 200 characters")
        .optional()
        .or(z.literal('')),

    bank_iban: z
        .string()
        .trim()
        .max(50, "IBAN must not exceed 50 characters")
        .regex(/^[A-Z0-9]*$/, "IBAN should only contain letters and numbers")
        .optional()
        .or(z.literal('')),

    // Store Policies & Content
    vendor_biography: z
        .string()
        .max(5000, "Biography must not exceed 5000 characters")
        .transform(sanitizeHtml)
        .optional()
        .or(z.literal('')),

    show_email: z.boolean().optional(),

    toc_enabled: z.boolean().optional(),

    store_toc: z
        .string()
        .max(10000, "Terms & Conditions must not exceed 10000 characters")
        .transform(sanitizeHtml)
        .optional()
        .or(z.literal('')),

    // Social Media
    social: socialLinksSchema,
});

// Partial schema for updates (all fields optional)
export const storeSettingsUpdateSchema = storeSettingsSchema.partial();

// Type inference
export type StoreSettings = z.infer<typeof storeSettingsSchema>;
export type StoreSettingsUpdate = z.infer<typeof storeSettingsUpdateSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
