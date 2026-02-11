"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";

interface StorePoliciesSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StorePoliciesSection({ form }: StorePoliciesSectionProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const tocEnabled = watch("toc_enabled");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Store Policies & Content</h3>

      {/* Vendor Biography */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Store Biography</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Textarea
            {...register("vendor_biography")}
            placeholder="Tell customers about your store..."
            className={`min-h-[120px] ${errors.vendor_biography ? "border-red-500" : ""}`}
            maxLength={5000}
          />
          {errors.vendor_biography && (
            <p className="text-sm text-red-500 mt-1">{errors.vendor_biography.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Describe your store, products, and what makes you unique (max 5000 characters)
          </p>
        </div>
      </div>

      {/* Show Email Publicly */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Show Email</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full flex items-center space-x-2">
          <Checkbox
            id="show_email"
            checked={watch("show_email") || false}
            onCheckedChange={(checked) => setValue("show_email", !!checked)}
          />
          <label
            htmlFor="show_email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Display email address publicly on store page
          </label>
        </div>
      </div>

      {/* Terms & Conditions Enabled */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Terms & Conditions</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full flex items-center space-x-2">
          <Checkbox
            id="toc_enabled"
            checked={tocEnabled || false}
            onCheckedChange={(checked) => setValue("toc_enabled", !!checked)}
          />
          <label
            htmlFor="toc_enabled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable custom terms & conditions for my store
          </label>
        </div>
      </div>

      {/* Terms & Conditions Text (conditional) */}
      {tocEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
          <div className="flex items-center justify-end gap-2 pt-2">
            <Label className="text-right font-bold text-gray-700">T&C Text</Label>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="w-full">
            <Textarea
              {...register("store_toc")}
              placeholder="Enter your terms and conditions..."
              className={`min-h-[200px] ${errors.store_toc ? "border-red-500" : ""}`}
              maxLength={10000}
            />
            {errors.store_toc && (
              <p className="text-sm text-red-500 mt-1">{errors.store_toc.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Your store's terms and conditions (max 10000 characters)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
