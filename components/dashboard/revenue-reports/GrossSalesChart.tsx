"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GrossSalesChartProps {
    data: Array<{
        date: string;
        gross_sales: number;
    }>;
}

export function GrossSalesChart({ data }: GrossSalesChartProps) {
    return (
        <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Gross sales</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="gross_sales" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", r: 3 }}
                        name="Month to date"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
