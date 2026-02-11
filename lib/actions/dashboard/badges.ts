"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";
import { revalidatePath } from "next/cache";

export interface BadgeLevel {
  id: number;
  badge_id: number;
  level: number;
  level_condition: string;
  level_data: string;
  vendor_count: number;
}

export interface BadgeAcquired {
  id: number;
  vendor_id: number;
  level_id: number;
  acquired_data: string;
  acquired_status: 'published' | 'draft';
  formatted_acquired_status: string;
  badge_seen: 0 | 1;
  created_at: number;
  formatted_created_at: string;
}

export interface BadgeEvent {
  id: string;
  title: string;
  description: string;
  condition_text: {
    prefix: string;
    suffix: string;
    type: string;
  };
  hover_text: string;
  group: {
    key: string;
    title: string;
  };
  has_multiple_levels: boolean;
  badge_logo: string;
  input_group_icon: {
    condition: string;
    data: string;
  };
}

export interface Badge {
  badge_id: number;
  badge_name: string;
  badge_logo: string;
  default_logo: string;
  formatted_default_logo: string;
  badge_logo_raw: string | number;
  event_type: string;
  badge_status: 'published' | 'draft';
  event: BadgeEvent;
  levels: BadgeLevel[];
  acquired: BadgeAcquired[];
  vendor_count?: number;
}

export interface BadgeFilters {
  page?: number;
  per_page?: number;
  badge_name?: string;
  event_type?: string;
  badge_status?: 'all' | 'published' | 'draft';
  vendor_id?: number;
  is_frontend?: boolean;
}

// Get all badges for the current vendor
export async function getVendorBadges(filters: BadgeFilters = {}) {
  try {
    const params = new URLSearchParams();
    
    // Set is_frontend to true to get vendor-specific badges
    params.append('is_frontend', 'true');
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.badge_name) params.append('badge_name', filters.badge_name);
    if (filters.event_type) params.append('event_type', filters.event_type);
    if (filters.badge_status && filters.badge_status !== 'all') {
      params.append('badge_status', filters.badge_status);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `seller-badge?${queryString}` : 'seller-badge?is_frontend=true';

    const response = await dokanRequest<Badge[]>({
      endpoint,
      method: "GET",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Error fetching vendor badges:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Get badge by ID
export async function getBadgeById(id: number) {
  try {
    const badge = await dokanRequest<Badge>({
      endpoint: `seller-badge/${id}?is_frontend=true`,
      method: "GET",
    });
    return { success: true, data: badge };
  } catch (error: any) {
    console.error("Error fetching badge:", error);
    return { success: false, error: error.message };
  }
}

// Get unseen badges for vendor
export async function getUnseenBadges() {
  try {
    const badges = await dokanRequest<Badge[]>({
      endpoint: 'seller-badge/vendor-unseen-badges?is_frontend=true',
      method: "GET",
    });
    return { success: true, data: badges };
  } catch (error: any) {
    console.error("Error fetching unseen badges:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Mark badges as seen
export async function markBadgesAsSeen() {
  try {
    await dokanRequest({
      endpoint: 'seller-badge/set-badge-as-seen',
      method: "POST",
    });
    
    revalidatePath("/dashboard/badges");
    return { success: true };
  } catch (error: any) {
    console.error("Error marking badges as seen:", error);
    return { success: false, error: error.message };
  }
}

// Get available badge events
export async function getBadgeEvents() {
  try {
    const events = await dokanRequest<BadgeEvent[]>({
      endpoint: 'seller-badge/events',
      method: "GET",
    });
    return { success: true, data: events };
  } catch (error: any) {
    console.error("Error fetching badge events:", error);
    return { success: false, error: error.message, data: [] };
  }
}
