"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, Store, Phone, Image as ImageIcon, User } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StoreBasicInfoSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

import { MediaUpload } from "@/components/dashboard/MediaUpload";

// ... (imports)

export function StoreBasicInfoSection({ form }: StoreBasicInfoSectionProps) {
  const { register, formState: { errors }, watch, setValue } = form;

  const bannerUrl = watch("banner");
  const gravatarUrl = watch("gravatar");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Store className="h-5 w-5 text-violet-600" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Your store's core identity and contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Name */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">
              Store Name <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              The name that appears on your shop page and products.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("store_name")}
                placeholder="Enter your store name"
                className={`pl-9 ${errors.store_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.store_name && (
              <p className="text-sm text-red-500 mt-1">{errors.store_name.message}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Phone Number</Label>
            <p className="text-sm text-gray-500 mt-1">
              Your contact number for customer inquiries.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                type="tel"
                className={`pl-9 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Banner Image */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Store Banner</Label>
            <p className="text-sm text-gray-500 mt-1">
              Recommended size: 1920x400px. Used on your store homepage.
            </p>
          </div>
          <div className="w-full">
            <MediaUpload
              value={bannerUrl}
              onChange={(url, id) => {
                setValue("banner", url);
                setValue("banner_id", id);
              }}
              label="Upload Banner"
              className="w-full"
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Profile Picture</Label>
            <p className="text-sm text-gray-500 mt-1">
              Recommended size: 300x300px. Appears next to your store name.
            </p>
          </div>
          <div className="w-full">
            <MediaUpload
              value={gravatarUrl}
              onChange={(url, id) => {
                setValue("gravatar", url);
                setValue("gravatar_id", id);
              }}
              label="Upload Avatar"
              circle={true}
              className="w-full flex justify-center md:justify-start"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
