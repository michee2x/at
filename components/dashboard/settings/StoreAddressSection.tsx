"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";

interface StoreAddressSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StoreAddressSection({ form }: StoreAddressSectionProps) {
  const { formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Store Address</h3>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Address</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500">
              Address fields will be implemented once the exact API structure is confirmed
            </p>
            <p className="text-xs text-gray-400 mt-2">
              The API currently returns an empty array for the address field
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Will include: Street Address, City, State, Zip Code, Country
          </p>
        </div>
      </div>
    </div>
  );
}
