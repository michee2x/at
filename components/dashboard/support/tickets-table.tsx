"use client";

import { Ticket } from "@/lib/actions/dashboard/support";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { updateTicketStatus, deleteTicket } from "@/lib/actions/dashboard/support";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TicketsTableProps {
    tickets: Ticket[];
}

const statusConfig = {
    open: { label: "Open", color: "bg-primary/10 text-primary" },
    closed: { label: "Closed", color: "bg-gray-100 text-gray-700" },
    pending: { label: "Pending", color: "bg-orange-100 text-orange-700" },
};

export function TicketsTable({ tickets }: TicketsTableProps) {
    const router = useRouter();

    const handleStatusChange = async (ticketId: number, status: "open" | "closed" | "pending") => {
        const result = await updateTicketStatus(ticketId, status);
        
        if (result.success) {
            toast.success(`Ticket status updated to ${status}`);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update ticket status");
        }
    };

    const handleDelete = async (ticketId: number) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return;

        const result = await deleteTicket(ticketId);
        
        if (result.success) {
            toast.success("Ticket deleted successfully");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to delete ticket");
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Eye className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No tickets found</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your filters or create a new ticket.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[140px]">Date</TableHead>
                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium">
                                #{ticket.ticket_id || ticket.id}
                            </TableCell>
                            <TableCell>
                                <div className="max-w-md truncate">{ticket.subject}</div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={statusConfig[ticket.status]?.color || ""}
                                >
                                    {statusConfig[ticket.status]?.label || ticket.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                                {format(new Date(ticket.created_at), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleStatusChange(ticket.id, "open")}
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Mark as Open
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleStatusChange(ticket.id, "pending")}
                                        >
                                            <Clock className="mr-2 h-4 w-4" />
                                            Mark as Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleStatusChange(ticket.id, "closed")}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Mark as Closed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(ticket.id)}
                                            className="text-red-600"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
