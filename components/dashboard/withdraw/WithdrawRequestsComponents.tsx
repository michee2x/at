"use client";

import { WithdrawRequest } from "@/lib/actions/dashboard/withdraw";
import Link from "next/link";

interface WithdrawRequestTabsProps {
    activeTab: string;
}

export function WithdrawRequestTabs({ activeTab }: WithdrawRequestTabsProps) {
    const tabs = [
        { label: "Pending Requests", value: "pending" },
        { label: "Approved Requests", value: "approved" },
        { label: "Cancelled Requests", value: "cancelled" },
    ];

    return (
        <div className="flex gap-6 mb-6">
            {tabs.map((tab) => (
                <Link 
                    key={tab.value}
                    href={`/dashboard/withdraw/requests?status=${tab.value}`}
                    className={`
                        text-sm font-medium hover:text-primary transition-colors
                        ${activeTab === tab.value ? "text-primary border-b-2 border-primary" : "text-gray-500"}
                    `}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}

interface WithdrawRequestTableProps {
    requests: WithdrawRequest[];
    isLoading: boolean;
}

export function WithdrawRequestTable({ requests, isLoading }: WithdrawRequestTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading...</div>;
    }

    if (requests.length === 0) {
        // Match the UI in screenshot roughly for empty state
        return (
            <div className="w-full">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 border-b border-gray-100 pb-3 mb-4 text-xs font-semibold text-gray-500 uppercase">
                    <div>AMOUNT</div>
                    <div>METHOD</div>
                    <div>DATE</div>
                    <div>CHARGE</div>
                    <div>RECEIVABLE</div>
                    <div>ACTIONS</div>
                </div>
                
                <div className="py-12 text-center text-gray-500 text-sm">
                    No results
                </div>
                
                {/* Scrollbar/Pagination placeholder */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full w-full overflow-hidden relative">
                     <div className="absolute left-0 top-0 h-full w-1/3 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex justify-between mt-2 text-gray-400">
                     <span>◀</span>
                     <span>▶</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-6 gap-4 border-b border-gray-100 pb-3 mb-4 text-xs font-semibold text-gray-500 uppercase">
                <div>AMOUNT</div>
                <div>METHOD</div>
                <div>DATE</div>
                <div>CHARGE</div>
                <div>RECEIVABLE</div>
                <div>ACTIONS</div>
            </div>
            
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req.id} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-50 last:border-0 text-sm text-gray-600">
                        <div>{req.amount}</div>
                        <div>{req.method}</div>
                        <div>{req.date}</div>
                        <div>{req.charge}</div>
                        <div>{req.receivable}</div>
                        <div>
                             {/* Actions like Cancel if pending? */}
                             <span className="text-gray-400">-</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
