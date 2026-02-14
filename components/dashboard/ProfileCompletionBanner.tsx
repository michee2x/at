"use client";

import { useState, useEffect } from "react";
import { X, Trophy, ArrowRight } from "lucide-react";
import { calculateProfileCompletion, getCompletionMessage, type StoreData } from "@/lib/utils/profile-completion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="border-none shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-100" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
      
      <CardContent className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Progress & Info */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Trophy className="h-5 w-5 text-yellow-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Complete Your Profile
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10">
              {percentage}% Ready
            </span>
          </div>
          
          <p className="text-indigo-100 text-lg mb-6 font-medium leading-relaxed">
            {message}
          </p>

          <div className="w-full bg-black/20 rounded-full h-3 mb-4 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {nextSteps.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nextSteps.slice(0, 3).map((step, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10 backdrop-blur-sm"
                >
                  {step}
                </span>
              ))}
              {nextSteps.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10 backdrop-blur-sm">
                  +{nextSteps.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
          <Button 
            asChild 
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-none"
            size="lg"
          >
            <Link href="/dashboard/settings/store">
              Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </CardContent>
    </Card>
  );
}
