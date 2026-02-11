"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { calculateProfileCompletion, getCompletionMessage, type StoreData } from "@/lib/utils/profile-completion";
import Link from "next/link";

interface ProfileCompletionBannerProps {
  storeData: StoreData;
}

const DISMISSAL_KEY = "profile-completion-banner-dismissed";

export function ProfileCompletionBanner({ storeData }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(DISMISSAL_KEY);
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(DISMISSAL_KEY, "true");
  };

  // Don't render on server or if dismissed
  if (!isClient || isDismissed) {
    return null;
  }

  const { percentage, nextSteps } = calculateProfileCompletion(storeData);
  const message = getCompletionMessage(percentage);

  // Don't show banner if profile is 100% complete
  if (percentage >= 100) {
    return null;
  }

  return (
    <div className="relative rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <div className="pr-8">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-900">
              Profile Completion: {percentage}%
            </span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-blue-600 mb-2">{message}</p>

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className="text-sm text-blue-700">
            <span className="font-medium">Next steps:</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Link to settings */}
        <Link
          href="/dashboard/settings/store"
          className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
        >
          Complete your profile →
        </Link>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 hover:opacity-70 text-blue-600"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
