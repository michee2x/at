import { useState } from "react";
import { Loader2 } from "lucide-react";

interface VerificationsStepProps {
  onNext: () => void;
}

export default function VerificationsStep({ onNext }: VerificationsStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    // Simulate API call to save verification info
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    onNext();
  };

  const methods = [
    { id: "passport", title: "Passport" },
    { id: "national_id", title: "National ID" },
    { id: "driving_license", title: "Driving License" }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="space-y-6 max-w-2xl">
        {methods.map((method) => (
          <div key={method.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">{method.title}</h3>
            </div>
            <div className="bg-white px-6 py-4">
              <button 
                type="button"
                className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded text-sm transition-colors"
              >
                Start Verification
              </button>
            </div>
          </div>
        ))}

        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-8 rounded-md transition-colors w-full sm:w-auto flex justify-center items-center h-11 min-w-[140px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
