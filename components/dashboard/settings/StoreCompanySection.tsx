"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, CreditCard, FileText, Landmark } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StoreCompanySectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StoreCompanySection({ form }: StoreCompanySectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="h-5 w-5 text-violet-600" />
          Company & Financial Information
        </CardTitle>
        <CardDescription>
          Legal business details and payout settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Name */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Company Name</Label>
            <p className="text-sm text-gray-500 mt-1">
              Your registered business name.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("company_name")}
                placeholder="Your Company LLC"
                className={`pl-9 ${errors.company_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.company_name && (
              <p className="text-sm text-red-500 mt-1">{errors.company_name.message}</p>
            )}
          </div>
        </div>

        {/* Company ID Number */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Company ID</Label>
            <p className="text-sm text-gray-500 mt-1">
              Business registration number.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("company_id_number")}
                placeholder="Registration Number"
                className={`pl-9 ${errors.company_id_number ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.company_id_number && (
              <p className="text-sm text-red-500 mt-1">{errors.company_id_number.message}</p>
            )}
          </div>
        </div>

        {/* VAT Number */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">VAT / Tax Number</Label>
            <p className="text-sm text-gray-500 mt-1">
              For tax compliance purposes.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("vat_number")}
                placeholder="VAT123456789"
                className={`pl-9 ${errors.vat_number ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.vat_number && (
              <p className="text-sm text-red-500 mt-1">{errors.vat_number.message}</p>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100 my-6" />

        {/* Bank Name */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Bank Name</Label>
            <p className="text-sm text-gray-500 mt-1">
              Name of the bank where you want to receive payments.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <Landmark className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("bank_name")}
                placeholder="e.g. Chase, HSBC"
                className={`pl-9 ${errors.bank_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.bank_name && (
              <p className="text-sm text-red-500 mt-1">{errors.bank_name.message}</p>
            )}
          </div>
        </div>

        {/* Bank IBAN */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Bank IBAN</Label>
            <p className="text-sm text-gray-500 mt-1">
              International Bank Account Number.
            </p>
          </div>
          <div className="w-full">
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                {...register("bank_iban")}
                placeholder="GB29NWBK60161331926819"
                className={`pl-9 ${errors.bank_iban ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
            {errors.bank_iban && (
              <p className="text-sm text-red-500 mt-1">{errors.bank_iban.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
