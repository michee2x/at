"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";
import { revalidatePath } from "next/cache";

export interface Announcement {
    id: number;
    title: string;
    content: string;
    status: 'publish' | 'pending' | 'draft' | 'future' | 'trash';
    read_status: 'read' | 'unread' | 'trash';
    created_at: string;
    updated_at: string;
}

export interface AnnouncementFilters {
    page?: number;
    per_page?: number;
    search?: string;
    read_status?: 'read' | 'unread' | 'trash' | 'all';
    from?: string;
    to?: string;
}

export interface AnnouncementsResponse {
    announcements: Announcement[];
    total: number;
    total_pages: number;
    current_page: number;
}

export async function getAnnouncements(filters: AnnouncementFilters = {}) {
    try {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.per_page) params.append('per_page', filters.per_page.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.read_status && filters.read_status !== 'all') {
            params.append('read_status', filters.read_status);
        }
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);

        const queryString = params.toString();
        const endpoint = queryString ? `announcement?${queryString}` : 'announcement';

        const response = await dokanRequest<Announcement[]>({
            endpoint,
            method: "GET",
        });

        // Note: Dokan API might return pagination info in headers
        // For now, we'll return the data as-is and handle pagination client-side
        return {
            success: true,
            data: response,
            total: response.length,
        };
    } catch (error: any) {
        console.error("Error fetching announcements:", error);
        return { success: false, error: error.message, data: [] };
    }
}

export async function getAnnouncementById(id: number) {
    try {
        const announcement = await dokanRequest<Announcement>({
            endpoint: `announcement/${id}`,
            method: "GET",
        });
        return { success: true, data: announcement };
    } catch (error: any) {
        console.error("Error fetching announcement:", error);
        return { success: false, error: error.message };
    }
}

export async function updateAnnouncementReadStatus(
    id: number,
    readStatus: 'read' | 'unread'
) {
    try {
        await dokanRequest({
            endpoint: `announcement/notice/${id}`,
            method: "PUT",
            body: { read_status: readStatus },
        });

        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating announcement read status:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteAnnouncement(id: number) {
    try {
        await dokanRequest({
            endpoint: `announcement/notice/${id}`,
            method: "DELETE",
        });

        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting announcement:", error);
        return { success: false, error: error.message };
    }
}

export async function restoreAnnouncement(id: number) {
    try {
        await dokanRequest({
            endpoint: `announcement/${id}/restore`,
            method: "POST",
        });

        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error restoring announcement:", error);
        return { success: false, error: error.message };
    }
}

export async function batchUpdateReadStatus(
    ids: number[],
    readStatus: 'read' | 'unread'
) {
    try {
        // Update each announcement individually
        const promises = ids.map(id =>
            updateAnnouncementReadStatus(id, readStatus)
        );

        await Promise.all(promises);
        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error batch updating read status:", error);
        return { success: false, error: error.message };
    }
}

export async function batchDeleteAnnouncements(ids: number[]) {
    try {
        await dokanRequest({
            endpoint: 'announcement/batch',
            method: "POST",
            body: { trash: ids },
        });

        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error batch deleting announcements:", error);
        return { success: false, error: error.message };
    }
}

export async function batchRestoreAnnouncements(ids: number[]) {
    try {
        await dokanRequest({
            endpoint: 'announcement/batch',
            method: "POST",
            body: { restore: ids },
        });

        revalidatePath("/dashboard/announcement");
        return { success: true };
    } catch (error: any) {
        console.error("Error batch restoring announcements:", error);
        return { success: false, error: error.message };
    }
}
