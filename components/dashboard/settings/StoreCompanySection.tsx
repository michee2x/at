"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";

interface StoreCompanySectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StoreCompanySection({ form }: StoreCompanySectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Company & Financial Information</h3>

      {/* Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Company Name</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("company_name")}
            placeholder="Your Company LLC"
            className={errors.company_name ? "border-red-500" : ""}
          />
          {errors.company_name && (
            <p className="text-sm text-red-500 mt-1">{errors.company_name.message}</p>
          )}
        </div>
      </div>

      {/* Company ID Number */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Company ID</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("company_id_number")}
            placeholder="Company registration number"
            className={errors.company_id_number ? "border-red-500" : ""}
          />
          {errors.company_id_number && (
            <p className="text-sm text-red-500 mt-1">{errors.company_id_number.message}</p>
          )}
        </div>
      </div>

      {/* VAT Number */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">VAT / Tax Number</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("vat_number")}
            placeholder="VAT123456789"
            className={errors.vat_number ? "border-red-500" : ""}
          />
          {errors.vat_number && (
            <p className="text-sm text-red-500 mt-1">{errors.vat_number.message}</p>
          )}
        </div>
      </div>

      {/* Bank Name */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Bank Name</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("bank_name")}
            placeholder="Name of your bank"
            className={errors.bank_name ? "border-red-500" : ""}
          />
          {errors.bank_name && (
            <p className="text-sm text-red-500 mt-1">{errors.bank_name.message}</p>
          )}
        </div>
      </div>

      {/* Bank IBAN */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
        <div className="flex items-center justify-end gap-2 pt-2">
          <Label className="text-right font-bold text-gray-700">Bank IBAN</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-full">
          <Input
            {...register("bank_iban")}
            placeholder="GB29NWBK60161331926819"
            className={errors.bank_iban ? "border-red-500" : ""}
          />
          {errors.bank_iban && (
            <p className="text-sm text-red-500 mt-1">{errors.bank_iban.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            International Bank Account Number for payments
          </p>
        </div>
      </div>
    </div>
  );
}
