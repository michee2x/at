"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { VendorVerificationResponse } from "@/types/verification.types";
import { getVendorVerificationMethods } from "@/lib/actions/dashboard/verification";
import { VerificationItem } from "@/components/dashboard/settings/VerificationItem";
import { toast } from "sonner";

/**
 * Verification Settings Page
 *
 * Displays all available verification methods for the vendor
 * Allows vendors to submit required documentation for account verification
 *
 * Architecture:
 * - Fetches verification methods on mount
 * - Renders reusable VerificationItem components for each method
 * - Handles loading and error states
 * - Implements refresh functionality
 */
export default function VerificationSettingsPage() {
  const [verificationData, setVerificationData] = useState<VendorVerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Fetch verification methods from API
   */
  const loadVerificationMethods = useCallback(async () => {
    try {
      setError(null);
      const data = await getVendorVerificationMethods();
      setVerificationData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load verification methods";
      setError(errorMessage);
      console.error("Error loading verification methods:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh verification methods (useful after submission)
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadVerificationMethods();
      toast.success("Verification methods refreshed");
    } catch (err) {
      toast.error("Failed to refresh verification methods");
    } finally {
      setIsRefreshing(false);
    }
  }, [loadVerificationMethods]);

  // Load data on mount
  useEffect(() => {
    loadVerificationMethods();
  }, [loadVerificationMethods]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading verification methods...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Verify your account to unlock additional features.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">{error}</p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render no data state
  if (!verificationData || verificationData.verification_methods.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Verify your account to unlock additional features.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No verification methods are currently available.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please contact support if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Count required vs optional verifications
  const requiredCount = verificationData.verification_methods.filter(
    (m) => m.required
  ).length;
  const optionalCount = verificationData.verification_methods.filter(
    (m) => !m.required
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete the verification steps below to enable all marketplace features.
            You have{" "}
            <span className="font-semibold">
              {requiredCount} required
            </span>{" "}
            and {optionalCount} optional verification(s).
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Info Card */}
      {requiredCount > 0 && (
        <Card className="border-violet-200 bg-violet-50">
          <CardContent className="pt-6">
            <p className="text-sm text-violet-900">
              You must complete all{" "}
              <span className="font-semibold">required verification(s)</span> to
              unlock full marketplace access. Optional verifications help boost
              your seller credibility.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Required Verifications Section */}
      {requiredCount > 0 && (
        <div>
          <h2 className="font-semibold text-lg text-gray-900 mb-4">
            Required Verification
          </h2>
          <div className="space-y-4">
            {verificationData.verification_methods
              .filter((method) => method.required)
              .map((method) => (
                <VerificationItem
                  key={method.id}
                  method={method}
                  onVerifyComplete={handleRefresh}
                />
              ))}
          </div>
        </div>
      )}

      {/* Optional Verifications Section */}
      {optionalCount > 0 && (
        <div>
          <h2 className="font-semibold text-lg text-gray-900 mb-4">
            Optional Verification
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            These verifications are optional but help increase buyer confidence and may boost your visibility.
          </p>
          <div className="space-y-4">
            {verificationData.verification_methods
              .filter((method) => !method.required)
              .map((method) => (
                <VerificationItem
                  key={method.id}
                  method={method}
                  onVerifyComplete={handleRefresh}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
