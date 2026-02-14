"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Mail, ShieldCheck, User } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StorePoliciesSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StorePoliciesSection({ form }: StorePoliciesSectionProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const tocEnabled = watch("toc_enabled");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldCheck className="h-5 w-5 text-violet-600" />
          Store Policies & Content
        </CardTitle>
        <CardDescription>
          Manage your store's public profile and terms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vendor Biography */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Store Biography</Label>
            <p className="text-sm text-gray-500 mt-1">
              Describe your store, products, and what makes you unique to customers.
            </p>
          </div>
          <div className="w-full">
            <Textarea
              {...register("vendor_biography")}
              placeholder="Tell customers about your store..."
              className={`min-h-[120px] ${errors.vendor_biography ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              maxLength={5000}
            />
            {errors.vendor_biography && (
              <p className="text-sm text-red-500 mt-1">{errors.vendor_biography.message}</p>
            )}
            <div className="flex justify-end mt-1">
               <span className="text-xs text-gray-400">
                 {watch("vendor_biography")?.length || 0}/5000
               </span>
            </div>
          </div>
        </div>

        {/* Show Email Publicly */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Contact Visibility</Label>
            <p className="text-sm text-gray-500 mt-1">
              Control how customers can contact you.
            </p>
          </div>
          <div className="w-full">
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50/50">
              <Checkbox
                id="show_email"
                checked={watch("show_email") || false}
                onCheckedChange={(checked) => setValue("show_email", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="show_email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-gray-500" />
                  Show email address publicly
                </label>
                <p className="text-sm text-muted-foreground">
                  If enabled, your email address will be visible on your store page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions Enabled */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Terms & Conditions</Label>
            <p className="text-sm text-gray-500 mt-1">
              Set custom terms for your store.
            </p>
          </div>
          <div className="w-full space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50/50">
              <Checkbox
                id="toc_enabled"
                checked={tocEnabled || false}
                onCheckedChange={(checked) => setValue("toc_enabled", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="toc_enabled"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  Enable custom terms & conditions
                </label>
                <p className="text-sm text-muted-foreground">
                  Add specific terms for returns, shipping, or service usage.
                </p>
              </div>
            </div>

            {/* Terms & Conditions Text (conditional) */}
            {tocEnabled && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Textarea
                  {...register("store_toc")}
                  placeholder="Enter your terms and conditions..."
                  className={`min-h-[200px] ${errors.store_toc ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  maxLength={10000}
                />
                {errors.store_toc && (
                  <p className="text-sm text-red-500 mt-1">{errors.store_toc.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
