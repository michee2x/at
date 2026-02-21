"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function PaymentSettingsPage() {
    // Ideally we would fetch listing of active methods here.
    // Based on user screenshots, initially it's empty.
    const [hasMethods, setHasMethods] = useState(false);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Payment Method <span className="text-gray-400">→</span></h1>
            <p className="text-primary text-lg mb-6">Visit Store</p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 text-sm text-gray-600 italic">
                These are the withdraw methods available for you. Please update your payment information below to submit withdraw requests and get your store payments seamlessly.
            </div>

            <div className="bg-white border rounded-t-lg p-4 flex justify-between items-center bg-gray-100/50">
                <h2 className="text-lg font-medium">Payment Methods</h2>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-gray-200 border-gray-300 hover:bg-gray-300">
                            Add Payment Method <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings/payment-manage-dokan_paystack" className="flex items-center cursor-pointer">
                                <span className="text-primary mr-2">☰</span> Direct to Paystack
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="bg-white border-x border-b rounded-b-lg p-12 text-center text-gray-500">
                {hasMethods ? (
                    <div>Methods list would go here</div>
                ) : (
                    "There is no payment method to show."
                )}
            </div>
        </div>
    );
}
