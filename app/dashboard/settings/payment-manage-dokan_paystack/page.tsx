"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaystackConnectModal } from "@/components/dashboard/settings/PaystackConnectModal";
import { getPaystackBanks, PaystackBank } from "@/lib/actions/dashboard/paystack";
import { ArrowLeft } from "lucide-react";

export default function PaystackManagePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [banks, setBanks] = useState<PaystackBank[]>([]);
    
    // In a real app we'd first check if already connected and show a different UI ("Connected").
    // Based on user flow, we are in the "Not connected" state.
    const isConnected = false; 

    useEffect(() => {
        // Pre-fetch banks so they are ready when modal opens
        async function fetchBanks() {
            const data = await getPaystackBanks();
            setBanks(data);
        }
        fetchBanks();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Paystack Settings <span className="text-gray-400">→</span></h1>
            <p className="text-purple-600 text-lg mb-6">Visit Store</p>

            <Link href="/dashboard/settings/payment" className="text-purple-600 mb-6 inline-flex items-center hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>

            <div className="bg-white border rounded-lg p-0 overflow-hidden max-w-2xl mt-4">
                <div className="flex">
                    <div className="w-1/3 border-r p-6 font-bold text-gray-800">
                        Paystack
                    </div>
                    <div className="w-2/3 p-12 flex flex-col items-center justify-center text-center bg-yellow-50/30">
                        {isConnected ? (
                            <div className="text-green-600">
                                Your account is connected with Paystack.
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500 mb-6 leading-relaxed">
                                    Your account is not connected with Paystack. Please click Sign Up button to connect your Paystack account.
                                </p>
                                <Button 
                                    className="bg-purple-600 hover:bg-purple-700 text-white w-full max-w-[200px]"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Connect Account
                                </Button>
                                {/* Note: User screenshot says "Connect Account" on button but text says "Sign Up button" */}
                            </>
                        )}
                    </div>
                </div>
                
                <div className="border-t p-4 flex justify-center bg-gray-50">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Update Settings
                    </Button>
                </div>
            </div>

            <PaystackConnectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                banks={banks}
            />
        </div>
    );
}
