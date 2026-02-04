"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://atlaze.com";

interface StatementSummary {
    total_items: number;
    total_debit: number;
    total_credit: number;
    balance: number;
}

export interface StatementTransaction {
    id: number;
    vendor_id: number;
    trn_id: string | null;
    trn_type: string;
    perticulars: string;
    trn_title: string;
    debit: number;
    credit: number;
    status: string;
    trn_date: string;
    balance_date: string;
    balance: number;
    url: string;
}

export async function getStatementSummary() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v1/vendor/reports/statement/summary?_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Statement summary API error:", await response.text());
        return { total_items: 0, total_debit: 0, total_credit: 0, balance: 0 };
    }

    const data: StatementSummary = await response.json();
    return data;
}

export async function getStatementTransactions(perPage: number = 100, page: number = 1) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const wpToken = (session as any)?.wpToken;
    if (!wpToken) throw new Error("No WordPress Token");

    const url = `${WC_API_URL}/wp-json/dokan/v1/vendor/reports/statement?per_page=${perPage}&page=${page}&_locale=user`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${wpToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Statement transactions API error:", await response.text());
        return [];
    }

    const data: StatementTransaction[] = await response.json();
    return data;
}
