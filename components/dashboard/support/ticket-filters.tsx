"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Search, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TicketFiltersProps {
    onFilterChange: (filters: {
        status?: string;
        search?: string;
        date?: string;
    }) => void;
}

export function TicketFilters({ onFilterChange }: TicketFiltersProps) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [date, setDate] = useState<Date>();

    const handleSearch = () => {
        onFilterChange({
            status: status !== "all" ? status : undefined,
            search: search || undefined,
            date: date ? format(date, "yyyy-MM-dd") : undefined,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        onFilterChange({
            status: value !== "all" ? value : undefined,
            search: search || undefined,
            date: date ? format(date, "yyyy-MM-dd") : undefined,
        });
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onFilterChange({
            status: status !== "all" ? status : undefined,
            search: search || undefined,
            date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setDate(undefined);
        onFilterChange({});
    };

    const hasActiveFilters = search || status !== "all" || date;

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search Tickets"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9"
                    />
                </div>
                <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-700">
                    Search
                </Button>
            </div>

            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Filter by Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
