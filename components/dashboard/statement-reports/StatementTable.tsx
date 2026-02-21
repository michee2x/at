"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatementTransaction } from "@/lib/actions/dashboard/statement-reports";

interface StatementTableProps {
    transactions: StatementTransaction[];
}

export function StatementTable({ transactions }: StatementTableProps) {
    const handleExport = () => {
        const today = new Date().toISOString().split('T')[0];
        const filename = `Statement-${today}.csv`;
        
        const headers = '"BALANCE DATE","TRANSACTION DATE","ID","TYPE","DEBIT","CREDIT","BALANCE"';
        const rows = transactions.map(trn => {
            return [
                `"${trn.balance_date}"`,
                `"${trn.trn_date || '-'}"`,
                `"${trn.id || '-'}"`,
                `"${trn.trn_title}"`,
                trn.debit,
                trn.credit,
                trn.balance,
            ].join(',');
        });

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <Button variant="default" size="sm" onClick={handleExport} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Export Statement
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                            <th className="pb-3 px-4">BALANCE DATE</th>
                            <th className="pb-3 px-4">TRANSACTION DATE</th>
                            <th className="pb-3 px-4">ID</th>
                            <th className="pb-3 px-4">TYPE</th>
                            <th className="pb-3 px-4 text-right">DEBIT</th>
                            <th className="pb-3 px-4 text-right">CREDIT</th>
                            <th className="pb-3 px-4 text-right">BALANCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((trn, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                    <td className="py-3 px-4">{trn.balance_date}</td>
                                    <td className="py-3 px-4">{trn.trn_date || '-'}</td>
                                    <td className="py-3 px-4">{trn.id || '-'}</td>
                                    <td className="py-3 px-4">{trn.trn_title}</td>
                                    <td className="py-3 px-4 text-right">
                                        {trn.debit > 0 ? `₦${trn.debit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        {trn.credit > 0 ? `₦${trn.credit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        ₦{trn.balance.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
