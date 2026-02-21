"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getWithdrawRequests, WithdrawRequest } from "@/lib/actions/dashboard/withdraw";
import { WithdrawRequestTabs, WithdrawRequestTable } from "@/components/dashboard/withdraw/WithdrawRequestsComponents";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WithdrawRequestsPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status") || "pending";
    
    const [requests, setRequests] = useState<WithdrawRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            try {
                 const data = await getWithdrawRequests(status, 1, 10);
                 setRequests(data);
            } catch (error) {
                console.error("Error fetching withdraw requests:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, [status]);

    return (
        <div className="p-6">
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Withdraw</h1>
                <Link href="/dashboard/withdraw">
                    <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/10">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
             </div>

             <div className="bg-white rounded-lg p-6 min-h-[400px]">
                <WithdrawRequestTabs activeTab={status} />
                <WithdrawRequestTable requests={requests} isLoading={isLoading} />
             </div>
        </div>
    );
}
