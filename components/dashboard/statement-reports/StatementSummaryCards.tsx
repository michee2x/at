interface StatementSummaryCardsProps {
    totalDebit: number;
    totalCredit: number;
    balance: number;
}

export function StatementSummaryCards({ totalDebit, totalCredit, balance }: StatementSummaryCardsProps) {
    const stats = [
        { label: "Total Debit", value: `₦${totalDebit.toFixed(2)}` },
        { label: "Total Credit", value: `₦${totalCredit.toFixed(2)}` },
        { label: "Balance", value: `₦${balance.toFixed(2)}` },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white border rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                    <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
                </div>
            ))}
        </div>
    );
}
