"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";

interface StoreBasicInfoSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StoreBasicInfoSection({ form }: StoreBasicInfoSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

      {/* Store Name */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">
            Store Name <span className="text-red-500">*</span>
          </Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("store_name")}
            placeholder="Enter your store name"
            className={errors.store_name ? "border-red-500" : ""}
          />
          {errors.store_name && (
            <p className="text-sm text-red-500 mt-1">{errors.store_name.message}</p>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Phone Number</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
            type="tel"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Your contact number for customer inquiries
          </p>
        </div>
      </div>

      {/* Banner Image */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Store Banner</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500">
              Banner upload functionality will be integrated with existing image upload component
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Recommended size: 1920x400px
            </p>
          </div>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Profile Picture</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500">
              Profile picture upload functionality will be integrated with existing image upload component
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Recommended size: 300x300px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
