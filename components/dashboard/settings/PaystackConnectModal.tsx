"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaystackBank, connectPaystackAccount } from "@/lib/actions/dashboard/paystack";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PaystackConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    banks: PaystackBank[];
}

export function PaystackConnectModal({ isOpen, onClose, banks }: PaystackConnectModalProps) {
    const [isExisting, setIsExisting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [businessName, setBusinessName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [accountCode, setAccountCode] = useState("");

    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true);

        const payload: any = { type: "individual" };

        if (isExisting) {
            if (!accountCode) {
                setError("Account Code is required.");
                setIsLoading(false);
                return;
            }
            payload.account_code = accountCode;
        } else {
            if (!businessName || !accountNumber || !bankCode) {
                setError("All fields are required.");
                setIsLoading(false);
                return;
            }
            payload.business_name = businessName;
            payload.account_number = accountNumber;
            payload.bank_code = bankCode;
        }

        try {
            const result = await connectPaystackAccount(payload);
            if (result.success) {
                toast.success("Paystack account connected successfully!");
                onClose();
            } else {
                // Show debug info if available
                const debugInfo = result.debug ? ` (Debug: ${JSON.stringify(result.debug)})` : "";
                setError((result.error || result.message || "Failed to connect.") + debugInfo);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isExisting ? "Connect your Paystack account" : "Connect your Paystack account"}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    {!isExisting && (
                        <p className="text-gray-500 mb-6 font-light text-sm">
                            Please fill out the form below to create your Paystack account.
                        </p>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {isExisting ? (
                            <div className="space-y-2">
                                <Label htmlFor="acc_code">Account Code <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="acc_code" 
                                    value={accountCode}
                                    onChange={(e) => setAccountCode(e.target.value)}
                                    placeholder="ACCT_xxxxxxxx"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="biz_name">Business Name: <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="biz_name"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="acc_num">Account Number: <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="acc_num"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank Code: <span className="text-red-500">*</span></Label>
                                    <Select value={bankCode} onValueChange={setBankCode}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your bank" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {banks.map((bank) => (
                                                <SelectItem key={bank.id} value={bank.code}>
                                                    {bank.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                                id="existing" 
                                checked={isExisting}
                                onCheckedChange={(checked) => setIsExisting(checked as boolean)}
                            />
                            <label
                                htmlFor="existing"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I already have a Paystack account
                            </label>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="text-purple-600 border-purple-200">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : (isExisting ? "Connect Account" : "Create Account")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
