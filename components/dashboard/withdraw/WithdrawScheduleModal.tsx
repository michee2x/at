"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface WithdrawScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    hasPaymentMethods: boolean;
    activeMethods: string[];
}

export function WithdrawScheduleModal({ 
    isOpen, 
    onClose, 
    hasPaymentMethods, 
    activeMethods 
}: WithdrawScheduleModalProps) {
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Withdraw Schedule</DialogTitle>
                </DialogHeader>

                {!hasPaymentMethods ? (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex gap-3 my-4">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-yellow-800">No payment methods found.</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Please set up your <Link href="/dashboard/settings/payment" className="text-purple-600 underline cursor-pointer">payment methods</Link> first.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="my-4">
                        {/* Placeholder for actual schedule form if active methods exist */}
                        <p className="text-sm text-gray-600">Select your preferred withdrawal schedule.</p>
                        {/* We would render schedule options here based on 'schedules' from disbursement API */}
                        <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-500 italic">
                            Schedule settings form would go here.
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="text-purple-600 border-purple-200">
                        Close
                    </Button>
                    {hasPaymentMethods && (
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Save Changes
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
