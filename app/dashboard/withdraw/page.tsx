"use client";

import { useState, useEffect } from "react";
import { 
    getWithdrawBalance, 
    getWithdrawDisbursement, 
    getWithdrawSettings,
    WithdrawBalanceResponse,
    WithdrawDisbursementResponse,
    WithdrawSettingsResponse
} from "@/lib/actions/dashboard/withdraw";
import { 
    WithdrawBalanceCard, 
    WithdrawPaymentDetailsCard, 
    WithdrawPaymentMethodsCard 
} from "@/components/dashboard/withdraw/WithdrawCards";

export default function WithdrawPage() {
    const [balanceData, setBalanceData] = useState<WithdrawBalanceResponse | null>(null);
    const [disbursementData, setDisbursementData] = useState<WithdrawDisbursementResponse | null>(null);
    const [settingsData, setSettingsData] = useState<WithdrawSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [balance, disbursement, settings] = await Promise.all([
                    getWithdrawBalance(),
                    getWithdrawDisbursement(),
                    getWithdrawSettings()
                ]);
                
                setBalanceData(balance);
                setDisbursementData(disbursement);
                setSettingsData(settings);
            } catch (error) {
                console.error("Error fetching withdraw data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const minWithdraw = disbursementData?.minimum_amount_needed || 0;
    // Fallback if disbursement API fails to return minimum, try balance API limit text?
    // balanceData.withdraw_limit is string "5000".
    
    const displayMinWithdraw = minWithdraw > 0 ? minWithdraw : parseFloat(balanceData?.withdraw_limit || "0");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Withdraw</h1>
            
            <WithdrawBalanceCard 
                balance={balanceData?.current_balance || 0}
                minWithdraw={displayMinWithdraw}
                isLoading={isLoading}
            />

            <WithdrawPaymentDetailsCard 
                lastPayment={balanceData?.last_withdraw}
                scheduleEnabled={disbursementData?.is_schedule_selected || false}
                activeMethods={settingsData?.active_methods || []}
                isLoading={isLoading}
            />

            <WithdrawPaymentMethodsCard 
                methods={settingsData?.payment_methods || []}
                activeMethods={settingsData?.active_methods || []}
                isLoading={isLoading}
            />
        </div>
    );
}
