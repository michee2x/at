"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://api.atlaze.com";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface TicketCounts {
    open: number;
    closed: number;
    pending: number;
    active: number;
    unread: number;
}

export interface Ticket {
    id: number;
    ticket_id: string;
    subject: string;
    message: string;
    status: "open" | "closed" | "pending";
    priority: "low" | "medium" | "high";
    created_at: string;
    updated_at: string;
    vendor_id: number;
    customer_name?: string;
    customer_email?: string;
}

export interface TicketFilters {
    status?: "all" | "open" | "closed" | "pending" | "active";
    search?: string;
    date?: string;
    page?: number;
    per_page?: number;
}

// ─────────────────────────────────────────────────────────────
// HELPER: DOKAN REQUEST
// ─────────────────────────────────────────────────────────────

async function dokanRequest(endpoint: string, options: RequestInit = {}) {
    const session = await getServerSession(authOptions);

    if (!session?.wpToken) {
        throw new Error("Authentication required");
    }

    const url = `${WC_API_URL}/wp-json/dokan/v1/${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.wpToken}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`Dokan API Error [${endpoint}]:`, error);
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
}

// ─────────────────────────────────────────────────────────────
// GET TICKET COUNTS
// ─────────────────────────────────────────────────────────────

export async function getTicketCounts(): Promise<{ success: boolean; data?: TicketCounts; error?: string }> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const vendorId = session.user.id;
        const data = await dokanRequest(`vendor-support/tickets/counts?vendor_id=${vendorId}&_locale=user`);

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching ticket counts:", error);
        return { success: false, error: "Failed to fetch ticket counts" };
    }
}

// ─────────────────────────────────────────────────────────────
// GET TICKETS
// ─────────────────────────────────────────────────────────────

export async function getTickets(filters: TicketFilters = {}): Promise<{ success: boolean; data?: Ticket[]; error?: string }> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const vendorId = session.user.id;
        const params = new URLSearchParams({
            vendor_id: vendorId,
            _locale: "user",
        });

        if (filters.status && filters.status !== "all") {
            params.append("status", filters.status);
        }

        if (filters.search) {
            params.append("search", filters.search);
        }

        if (filters.date) {
            params.append("date", filters.date);
        }

        if (filters.page) {
            params.append("page", filters.page.toString());
        }

        if (filters.per_page) {
            params.append("per_page", filters.per_page.toString());
        }

        const data = await dokanRequest(`vendor-support/tickets?${params.toString()}`);

        return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return { success: false, error: "Failed to fetch tickets" };
    }
}

// ─────────────────────────────────────────────────────────────
// CREATE TICKET
// ─────────────────────────────────────────────────────────────

export async function createTicket(ticketData: {
    subject: string;
    message: string;
    priority?: "low" | "medium" | "high";
}): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const data = await dokanRequest("vendor-support/tickets", {
            method: "POST",
            body: JSON.stringify({
                ...ticketData,
                vendor_id: session.user.id,
            }),
        });

        revalidatePath("/dashboard/support");
        return { success: true, data };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return { success: false, error: "Failed to create ticket" };
    }
}

// ─────────────────────────────────────────────────────────────
// UPDATE TICKET STATUS
// ─────────────────────────────────────────────────────────────

export async function updateTicketStatus(
    ticketId: number,
    status: "open" | "closed" | "pending"
): Promise<{ success: boolean; data?: Ticket; error?: string }> {
    try {
        const data = await dokanRequest(`vendor-support/tickets/${ticketId}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });

        revalidatePath("/dashboard/support");
        return { success: true, data };
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return { success: false, error: "Failed to update ticket status" };
    }
}

// ─────────────────────────────────────────────────────────────
// DELETE TICKET
// ─────────────────────────────────────────────────────────────

export async function deleteTicket(ticketId: number): Promise<{ success: boolean; error?: string }> {
    try {
        await dokanRequest(`vendor-support/tickets/${ticketId}`, {
            method: "DELETE",
        });

        revalidatePath("/dashboard/support");
        return { success: true };
    } catch (error) {
        console.error("Error deleting ticket:", error);
        return { success: false, error: "Failed to delete ticket" };
    }
}
