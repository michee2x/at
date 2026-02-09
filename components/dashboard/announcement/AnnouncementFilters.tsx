"use client";

import { useState } from "react";
import { AnnouncementFilters as Filters } from "@/lib/actions/dashboard/announcement";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface AnnouncementFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function AnnouncementFilters({ 
  filters, 
  onFiltersChange 
}: AnnouncementFiltersProps) {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleReadStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      read_status: value as Filters['read_status'],
      page: 1 
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    onFiltersChange({ 
      page: 1, 
      per_page: filters.per_page || 10,
      read_status: 'all' 
    });
  };

  const hasActiveFilters = search || (filters.read_status && filters.read_status !== 'all');

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Read Status Filter */}
      <Select
        value={filters.read_status || 'all'}
        onValueChange={handleReadStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Announcements</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="trash">Trash</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
