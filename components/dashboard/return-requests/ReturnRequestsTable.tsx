"use client";

import { ReturnRequest } from "@/lib/actions/dashboard/return-requests";
import { ReturnStatusBadge } from "./ReturnStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ReturnRequestsTableProps {
  requests: ReturnRequest[];
}

export function ReturnRequestsTable({ requests }: ReturnRequestsTableProps) {
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);

  const toggleRequest = (requestId: number) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId],
    );
  };

  const toggleAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map((request) => request.id));
    }
  };

  const isAllSelected =
    requests.length > 0 && selectedRequests.length === requests.length;
  const isSomeSelected =
    selectedRequests.length > 0 && selectedRequests.length < requests.length;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all return requests"
                  className={cn(
                    isSomeSelected && "data-[state=checked]:bg-primary/50",
                  )}
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Order ID
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Items
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((request) => (
              <tr
                key={request.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors",
                  selectedRequests.includes(request.id) && "bg-muted/30",
                )}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedRequests.includes(request.id)}
                    onCheckedChange={() => toggleRequest(request.id)}
                    aria-label={`Select return request ${request.id}`}
                  />
                </td>
                <td className="p-4 text-sm font-medium">#{request.id}</td>
                <td className="p-4 text-sm">#{request.order_id}</td>
                <td className="p-4 text-sm">
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    {request.items.length} item
                    {request.items.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="p-4">
                  <ReturnStatusBadge status={request.status} />
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(request.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3 p-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className={cn(
              "border rounded-lg p-4 space-y-2",
              selectedRequests.includes(request.id) && "bg-muted/30",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedRequests.includes(request.id)}
                  onCheckedChange={() => toggleRequest(request.id)}
                  aria-label={`Select return request ${request.id}`}
                />
                <div>
                  <p className="font-medium text-sm">Request #{request.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Order #{request.order_id}
                  </p>
                </div>
              </div>
              <ReturnStatusBadge status={request.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {request.items.length} item
                {request.items.length !== 1 ? "s" : ""}
              </span>
              <span>{formatDate(request.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
