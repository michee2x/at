"use client";

import { useState } from "react";
import { Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface Column {
    key: string;
    label: string;
    visible: boolean;
}

interface DataTableProps {
    title: string;
    columns: Column[];
    data: any[];
    onDownload: () => void;
    onColumnToggle: (key: string) => void;
}

export function DataTable({ title, columns, data, onDownload, onColumnToggle }: DataTableProps) {
    const visibleColumns = columns.filter(col => col.visible);

    return (
        <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <div className="p-2">
                                <div className="text-sm font-medium mb-2">Columns:</div>
                                {columns.map((col) => (
                                    <div key={col.key} className="flex items-center justify-between py-2">
                                        <span className="text-sm">{col.label}</span>
                                        <Switch
                                            checked={col.visible}
                                            onCheckedChange={() => onColumnToggle(col.key)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                            {visibleColumns.map((col) => (
                                <th key={col.key} className="pb-3 px-4">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                                {visibleColumns.map((col) => (
                                    <td key={col.key} className="py-3 px-4">
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
