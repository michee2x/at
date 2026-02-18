import { Suspense } from "react";
import { getTicketCounts, getTickets } from "@/lib/actions/dashboard/support";
import { TicketStats } from "@/components/dashboard/support/ticket-stats";
import { TicketFiltersWrapper } from "@/components/dashboard/support/ticket-filters-wrapper";
import { TicketsTable } from "@/components/dashboard/support/tickets-table";
import { AddTicketDialog } from "@/components/dashboard/support/add-ticket-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportPageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        date?: string;
    }>;
}

export default async function SupportPage({ searchParams }: SupportPageProps) {
    const params = await searchParams;
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Support</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your support tickets and get help from the admin team
                    </p>
                </div>
                <AddTicketDialog />
            </div>

            {/* Statistics */}
            <Suspense fallback={<StatsLoading />}>
                <TicketStatsSection />
            </Suspense>

            {/* Filters and Table */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6 space-y-4">
                    <TicketFiltersWrapper />
                    <Suspense fallback={<TableLoading />}>
                        <TicketsSection filters={params} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// SERVER COMPONENTS
// ─────────────────────────────────────────────────────────────

async function TicketStatsSection() {
    const result = await getTicketCounts();
    
    if (!result.success || !result.data) {
        return (
            <div className="text-center py-4 text-red-600">
                Failed to load ticket statistics
            </div>
        );
    }

    return <TicketStats counts={result.data} />;
}

async function TicketsSection({ filters }: { filters: any }) {
    const result = await getTickets(filters);
    
    if (!result.success || !result.data) {
        return (
            <div className="text-center py-8 text-red-600">
                Failed to load tickets
            </div>
        );
    }

    return <TicketsTable tickets={result.data} />;
}



// ─────────────────────────────────────────────────────────────
// LOADING STATES
// ─────────────────────────────────────────────────────────────

function StatsLoading() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function TableLoading() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
}
