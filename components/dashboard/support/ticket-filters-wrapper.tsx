"use client";

import { useRouter } from "next/navigation";
import { TicketFilters } from "./ticket-filters";

export function TicketFiltersWrapper() {
    const router = useRouter();

    const handleFilterChange = (filters: {
        status?: string;
        search?: string;
        date?: string;
    }) => {
        const params = new URLSearchParams();

        if (filters.status) params.set("status", filters.status);
        if (filters.search) params.set("search", filters.search);
        if (filters.date) params.set("date", filters.date);

        const queryString = params.toString();
        router.push(`/dashboard/support${queryString ? `?${queryString}` : ""}`);
    };

    return <TicketFilters onFilterChange={handleFilterChange} />;
}
