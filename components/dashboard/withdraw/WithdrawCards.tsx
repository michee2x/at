"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { WithdrawScheduleModal } from "./WithdrawScheduleModal";

// --- Balance Card ---
interface WithdrawBalanceCardProps {
    balance: number;
    minWithdraw: number;
    isLoading: boolean;
}

export function WithdrawBalanceCard({ balance, minWithdraw, isLoading }: WithdrawBalanceCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4 text-sm text-gray-700">Balance</h3>
                <Skeleton className="h-8 w-40 mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-60 bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4 text-sm text-gray-700">Balance</h3>
            <div className="text-3xl font-bold text-gray-800 mb-2">
                ₦{balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-gray-500 text-sm">
                Minimum Withdraw Amount: <span className="font-semibold text-gray-700">₦{minWithdraw?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
}

// --- Payment Details Card ---
interface WithdrawPaymentDetailsCardProps {
    lastPayment?: any;
    scheduleEnabled: boolean;
    isLoading: boolean;
    activeMethods: string[];
}

export function WithdrawPaymentDetailsCard({ 
    lastPayment, 
    scheduleEnabled, 
    isLoading,
    activeMethods 
}: WithdrawPaymentDetailsCardProps) {
    const [isScheduleEnabled, setIsScheduleEnabled] = useState(scheduleEnabled);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-6 text-sm text-gray-700">Payment Details</h3>
                <div className="space-y-6">
                    <div>
                         <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                         <Skeleton className="h-4 w-64 bg-gray-200" />
                    </div>
                    <div>
                         <Skeleton className="h-4 w-32 mb-2 bg-gray-200" />
                         <Skeleton className="h-4 w-full bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-lg p-6 mb-6">
             <h3 className="font-semibold mb-6 text-sm text-gray-700">Payment Details</h3>
             
             {/* Last Payment Section */}
             <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                <div>
                     <h4 className="text-base text-gray-500 mb-1">Last Payment</h4>
                     <p className="text-gray-400 text-sm">
                        {lastPayment && Object.keys(lastPayment).length > 0
                            ? "Last payment processed on..." // Placeholder as API response for 'last_withdraw' is {} in example
                            : "You do not have any approved withdraw yet."
                        }
                     </p>
                </div>
                <Link href="/dashboard/withdraw/requests">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-4 h-9">
                        View Payments
                    </Button>
                </Link>
             </div>

             {/* Schedule Section */}
             <div className="flex justify-between items-start">
                <div className="flex-1 pr-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-800">Schedule</h4>
                        <Switch 
                            checked={isScheduleEnabled} 
                            onCheckedChange={setIsScheduleEnabled}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Please update your withdraw schedule selection to get payment automatically.
                    </p>
                </div>
                
                {isScheduleEnabled && (
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-4 h-9"
                    >
                        Edit schedule
                    </Button>
                )}
             </div>

             <WithdrawScheduleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hasPaymentMethods={activeMethods.length > 0}
                activeMethods={activeMethods}
             />
        </div>
    );
}

// --- Payment Methods Card ---
interface WithdrawPaymentMethodsCardProps {
    methods: any[];
    activeMethods: string[];
    isLoading: boolean;
}

export function WithdrawPaymentMethodsCard({ methods, activeMethods, isLoading }: WithdrawPaymentMethodsCardProps) {
    if (isLoading) {
         return (
            <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-sm text-gray-700">Payment Methods</h3>
                <Skeleton className="h-20 w-full bg-gray-200" />
            </div>
         );
    }

    return (
        <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-sm text-gray-700">Payment Methods</h3>
            {/* Logic to list methods could be complex depending on API provided structure. 
                Example response showed 'active_methods': [] and 'payment_methods': []. 
                Assuming empty state for now based on user screenshot showing nothing.
            */}
            <div className="py-8 text-center text-gray-400 text-sm">
                {activeMethods.length === 0 ? "No active payment methods found." : (
                    <ul>
                        {activeMethods.map(m => <li key={m}>{m}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );
}
