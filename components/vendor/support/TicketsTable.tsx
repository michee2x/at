"use client";

import { VendorSupportTicket } from "@/lib/actions/vendor/support";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TicketsTableProps {
  tickets: VendorSupportTicket[];
}

export function VendorTicketsTable({ tickets }: TicketsTableProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <svg
            className="h-8 w-8 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 7v10a2 2 0 0 0 2 2h14"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          No tickets found
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting filters or check back later.
        </p>
      </div>
    );
  }

  const statusLabel = (s?: string) => {
    if (!s) return "Unknown";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Ticket ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="w-[120px]">Customer</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[140px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">
                #{t.ticket_id ?? t.id}
              </TableCell>
              <TableCell>
                <div className="max-w-md truncate">{t.subject ?? "-"}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {t.customer_name ?? t.customer_email ?? "-"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel(t.status)}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {t.created_at
                  ? format(new Date(t.created_at), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
