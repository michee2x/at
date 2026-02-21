import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PaymentSetupStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function PaymentSetupStep({ onNext, onSkip }: PaymentSetupStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaystackEnabled, setIsPaystackEnabled] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    // Simulate API call to save payment info
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Payment Setup</h2>

      <div className="space-y-8 max-w-lg">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="text-sm font-semibold text-gray-800">Paystack</span>
          <Switch 
            checked={isPaystackEnabled}
            onCheckedChange={setIsPaystackEnabled}
            className="data-[state=checked]:bg-gray-400" 
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-8 rounded-md transition-colors w-full sm:w-auto flex justify-center items-center h-11 min-w-[140px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          </button>
          <button
            onClick={onSkip}
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-8 rounded-md transition-colors w-full sm:w-auto h-11"
          >
            Skip this step
          </button>
        </div>
      </div>
    </div>
  );
}
