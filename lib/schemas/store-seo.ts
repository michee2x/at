import { z } from "zod";

export const storeSeoSchema = z.object({
  // General SEO
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  metaKeywords: z.string().optional(),

  // Facebook / Open Graph
  ogTitle: z.string().optional(),
  ogDesc: z.string().optional(),
  ogImage: z.string().optional().nullable(), // URL for display
  ogImageId: z.number().optional().nullable(), // ID for API

  // Twitter
  twitterTitle: z.string().optional(),
  twitterDesc: z.string().optional(),
  twitterImage: z.string().optional().nullable(), // URL for display
  twitterImageId: z.number().optional().nullable(), // ID for API
});

export type StoreSeoFormValues = z.infer<typeof storeSeoSchema>;

// API expects array of { id: string, value: string | number | null }
export interface SeoApiItem {
  id: string;
  value: string | number | null;
}
