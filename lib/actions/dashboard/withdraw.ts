"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://atlaze.com";

// Types
export interface WithdrawDisbursementResponse {
    enabled: boolean;
    selected_schedule: string; // e.g., "biweekly"
    minimum_amount_list: number[];
    minimum_amount_selected: number;
    reserve_balance_list: number[];
    reserve_balance_selected: number;
    default_method: string;
    schedules: {
        [key: string]: {
            next: string;
            title: string;
            description: string;
        };
    };
    active_methods: string[];
    minimum_amount_needed: number;
    is_schedule_selected: boolean;
}

export interface WithdrawBalanceResponse {
    current_balance: number;
    withdraw_limit: string;
    withdraw_threshold: number;
    withdraw_methods: any[];
    last_withdraw: any; // Can be object or empty
}

export interface WithdrawSettingsResponse {
    withdraw_method: string;
    payment_methods: any[];
    active_methods: string[]; // e.g. ["paypal"]
    setup_url: string;
}

export interface WithdrawRequest {
    id: number;
    amount: string;
    date: string;
    status: string; // pending, approved, cancelled
    method: string;
    note: string;
    details: string; // HTML string typically
    charge: string;
    receivable: string;
}

// Actions

export async function getWithdrawDisbursement() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v2/withdraw/disbursement?_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Withdraw Disbursement API error:", await response.text());
        return null;
    }

    return await response.json() as WithdrawDisbursementResponse;
}

export async function getWithdrawBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v1/withdraw/balance?_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Withdraw Balance API error:", await response.text());
        return null; // Return null to handle gracefully
    }

    return await response.json() as WithdrawBalanceResponse;
}

export async function getWithdrawSettings() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v2/withdraw/settings?_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Withdraw Settings API error:", await response.text());
        return null;
    }

    return await response.json() as WithdrawSettingsResponse;
}

export async function getWithdrawRequests(status: string = "pending", page: number = 1, per_page: number = 10) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    // "dokan/v1/withdraw" seems to be the endpoint based on user provided URL for "Pending Request"
    // user_id param was in user URL, usually retrieved from token, but might be needed if API requires it.
    // However, usually "dokan/v1/withdraw" implies current user. 
    // The user provided URL: .../withdraw?page=1&status=pending&per_page=10&user_id=1&_locale=user
    // We should include user_id if we can get it, or hope the token handles it. 
    // Usually Dokan REST API uses the token to identify the vendor.
    
    // Status handling: pending, approved, cancelled
    
    const url = `${WC_API_URL}/wp-json/dokan/v1/withdraw?per_page=${per_page}&page=${page}&status=${status}&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Withdraw Requests API error:", await response.text());
        return [];
    }

    return await response.json() as WithdrawRequest[];
}
