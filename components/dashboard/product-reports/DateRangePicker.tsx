"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DateRangePickerProps {
    onDateChange: (after: string, before: string) => void;
    isLoading?: boolean;
}

export function DateRangePicker({ onDateChange, isLoading = false }: DateRangePickerProps) {
    const [after, setAfter] = useState("2026-02-01T00:00:00");
    const [before, setBefore] = useState("2026-02-03T23:59:59");

    const handleApply = () => {
        onDateChange(after, before);
    };

    return (
        <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Date range</label>
                    <input
                        type="date"
                        value={after.split('T')[0]}
                        onChange={(e) => setAfter(`${e.target.value}T00:00:00`)}
                        className="border rounded px-3 py-2"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">To</label>
                    <input
                        type="date"
                        value={before.split('T')[0]}
                        onChange={(e) => setBefore(`${e.target.value}T23:59:59`)}
                        className="border rounded px-3 py-2"
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleApply}
                    disabled={isLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Apply
                </button>
            </div>
        </div>
    );
}
