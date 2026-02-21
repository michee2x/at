import { Card, CardContent } from "@/components/ui/card";
import { TicketCounts } from "@/lib/actions/dashboard/support";
import {
    TicketIcon,
    CheckCircle2,
    Clock,
    Activity,
    Mail,
    FileText,
    MessageSquare
} from "lucide-react";

interface TicketStatsProps {
    counts: TicketCounts;
}

const statCards = [
    {
        key: "open" as const,
        label: "Open",
        icon: FileText,
        color: "text-primary",
        bgColor: "bg-blue-50",
    },
    {
        key: "closed" as const,
        label: "Closed",
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        key: "pending" as const,
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
    },
    {
        key: "active" as const,
        label: "Active",
        icon: MessageSquare,
        color: "text-primary/80",
        bgColor: "bg-purple-50",
    },
    {
        key: "unread" as const,
        label: "Unread",
        icon: Mail,
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
];

export function TicketStats({ counts }: TicketStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map(({ key, label, icon: Icon, color, bgColor }) => (
                <Card key={key} className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {counts[key] || 0}
                                </p>
                            </div>
                            <div className={`${bgColor} p-3 rounded-lg`}>
                                <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
