"use client";

import { useState, useEffect } from "react";
import { getStatementSummary, getStatementTransactions, StatementTransaction } from "@/lib/actions/dashboard/statement-reports";
import { StatementSummaryCards } from "@/components/dashboard/statement-reports/StatementSummaryCards";
import { StatementTable } from "@/components/dashboard/statement-reports/StatementTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatementReportsPage() {
    const [summary, setSummary] = useState({
        total_items: 0,
        total_debit: 0,
        total_credit: 0,
        balance: 0,
    });
    const [transactions, setTransactions] = useState<StatementTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStatementData();
    }, []);

    const fetchStatementData = async () => {
        setIsLoading(true);
        try {
            const [summaryData, transactionsData] = await Promise.all([
                getStatementSummary(),
                getStatementTransactions(100, 1),
            ]);

            setSummary(summaryData);
            setTransactions(transactionsData);
        } catch (error) {
            console.error("Error fetching statement data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Statement</h1>
                
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border rounded-lg p-6">
                            <Skeleton className="h-4 w-24 mb-4 mx-auto" />
                            <Skeleton className="h-8 w-32 mx-auto" />
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-9 w-36" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Statement</h1>
            
            <StatementSummaryCards
                totalDebit={summary.total_debit}
                totalCredit={summary.total_credit}
                balance={summary.balance}
            />
            
            <StatementTable transactions={transactions} />
        </div>
    );
}
