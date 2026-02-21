"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Wizard Steps Components
import WelcomeStep from "./steps/WelcomeStep";
import StoreSetupStep from "./steps/StoreSetupStep";
import PaymentSetupStep from "./steps/PaymentSetupStep";
import VerificationsStep from "./steps/VerificationsStep";
import ReadyStep from "./steps/ReadyStep";

export type WizardStep = "welcome" | "store" | "payment" | "verifications" | "ready";

const steps = [
  { id: "store", title: "Store" },
  { id: "payment", title: "Payment" },
  { id: "verifications", title: "Verifications" },
  { id: "ready", title: "Ready!" },
];

export default function VendorSetupPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome");

  // Determine active step index for the progress bar
  const getActiveStepIndex = () => {
    if (currentStep === "welcome") return -1; // Before the first visual step
    return steps.findIndex((step) => step.id === currentStep);
  };

  const activeIndex = getActiveStepIndex();

  const handleNext = (nextStep: WizardStep) => {
    setCurrentStep(nextStep);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-display text-gray-700 italic">Atlaze</h1>
      </div>

      {/* Progress Bar (Visible only after Welcome) */}
      <div className="w-full max-w-4xl mb-8">
        <div className="relative">
          {/* Step track */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />

          {/* Active track */}
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-violet-600 -translate-y-1/2 transition-all duration-300"
            style={{
              width: activeIndex >= 0 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "0%",
              opacity: activeIndex >= 0 ? 1 : 0.5,
            }}
          />

          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isPast = activeIndex > index;
              const isCurrent = activeIndex === index;
              
              const isWelcomeOrPast = activeIndex === -1 ? false : isPast || isCurrent;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <span
                    className={cn(
                      "text-xs font-semibold mb-2 transition-colors",
                      isWelcomeOrPast ? "text-violet-600" : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[#f3f4f6] transition-colors relative z-10",
                      isCurrent
                        ? "border-violet-600 ring-4 ring-violet-100"
                        : isPast
                        ? "border-violet-600 bg-violet-600"
                        : "border-gray-300"
                    )}
                  >
                    {isPast && (
                      <div className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-4xl bg-white rounded-md shadow-sm border border-gray-100 p-8 md:p-12 min-h-[400px]">
        {currentStep === "welcome" && <WelcomeStep onNext={() => handleNext("store")} />}
        {currentStep === "store" && <StoreSetupStep onNext={() => handleNext("payment")} />}
        {currentStep === "payment" && (
          <PaymentSetupStep
            onNext={() => handleNext("verifications")}
            onSkip={() => handleNext("verifications")}
          />
        )}
        {currentStep === "verifications" && <VerificationsStep onNext={() => handleNext("ready")} />}
        {currentStep === "ready" && <ReadyStep />}
      </div>
    </div>
  );
}
