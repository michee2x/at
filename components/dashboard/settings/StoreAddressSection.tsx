"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import type { StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Note: We would typically fetch countries/states from an API or use a library
// for now we will use text inputs for country/state to be safe with unknown API values
// or specific hardcoded values if we knew them. Text inputs are safest for now.

interface StoreAddressSectionProps {
  form: UseFormReturn<StoreSettingsUpdate>;
}

export function StoreAddressSection({ form }: StoreAddressSectionProps) {
  const { register, formState: { errors } } = form;

  // Helper to get nested error
  const getAddressError = (field: string) => {
    const error = errors.address?.[field as keyof typeof errors.address] as { message?: string } | undefined;
    return error?.message;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="h-5 w-5 text-violet-600" />
          Store Address
        </CardTitle>
        <CardDescription>
          Physical location of your store for shipping and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Street Address 1 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Primary business address.
            </p>
          </div>
          <div className="w-full">
            <Input
              {...register("address.street_1")}
              placeholder="123 Store St"
              className={getAddressError("street_1") ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {getAddressError("street_1") && (
              <p className="text-sm text-red-500 mt-1">{getAddressError("street_1")}</p>
            )}
          </div>
        </div>

        {/* Street Address 2 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">Address Line 2</Label>
            <p className="text-sm text-gray-500 mt-1">
              Suite, unit, building, etc.
            </p>
          </div>
          <div className="w-full">
            <Input
              {...register("address.street_2")}
              placeholder="Suite 101"
            />
          </div>
        </div>

        {/* City & Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">
              City & Postal Code <span className="text-red-500">*</span>
            </Label>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div>
              <Input
                {...register("address.city")}
                placeholder="City"
                className={getAddressError("city") ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {getAddressError("city") && (
                <p className="text-sm text-red-500 mt-1">{getAddressError("city")}</p>
              )}
            </div>
            <div>
              <Input
                {...register("address.zip")}
                placeholder="Zip/Postal Code"
                className={getAddressError("zip") ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {getAddressError("zip") && (
                <p className="text-sm text-red-500 mt-1">{getAddressError("zip")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Country & State */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 items-start">
          <div>
            <Label className="text-base font-semibold text-gray-900">
              Country & State <span className="text-red-500">*</span>
            </Label>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div>
              <Select
                onValueChange={(value) => {
                  form.setValue("address.country", value);
                  // Reset state when country changes if it's not Nigeria?
                  // For now, keep it simple.
                }}
                defaultValue={form.watch("address.country") || "NG"}
              >
                <SelectTrigger className={getAddressError("country") ? "border-red-500 ring-offset-red-500" : ""}>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getAddressError("country") && (
                <p className="text-sm text-red-500 mt-1">{getAddressError("country")}</p>
              )}
            </div>
            <div>
              {form.watch("address.country") === 'NG' ? (
                <Select
                  onValueChange={(value) => form.setValue("address.state", value)}
                  defaultValue={form.watch("address.state")}
                >
                  <SelectTrigger className={getAddressError("state") ? "border-red-500 ring-offset-red-500" : ""}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  {...register("address.state")}
                  placeholder="State/Province"
                  className={getAddressError("state") ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              )}
              {getAddressError("state") && (
                <p className="text-sm text-red-500 mt-1">{getAddressError("state")}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
];

const NIGERIAN_STATES = [
  { code: 'AB', name: 'Abia' },
  { code: 'FC', name: 'Abuja (FCT)' },
  { code: 'AD', name: 'Adamawa' },
  { code: 'AK', name: 'Akwa Ibom' },
  { code: 'AN', name: 'Anambra' },
  { code: 'BA', name: 'Bauchi' },
  { code: 'BY', name: 'Bayelsa' },
  { code: 'BE', name: 'Benue' },
  { code: 'BO', name: 'Borno' },
  { code: 'CR', name: 'Cross River' },
  { code: 'DE', name: 'Delta' },
  { code: 'EB', name: 'Ebonyi' },
  { code: 'ED', name: 'Edo' },
  { code: 'EK', name: 'Ekiti' },
  { code: 'EN', name: 'Enugu' },
  { code: 'GO', name: 'Gombe' },
  { code: 'IM', name: 'Imo' },
  { code: 'JI', name: 'Jigawa' },
  { code: 'KD', name: 'Kaduna' },
  { code: 'KN', name: 'Kano' },
  { code: 'KT', name: 'Katsina' },
  { code: 'KE', name: 'Kebbi' },
  { code: 'KO', name: 'Kogi' },
  { code: 'KW', name: 'Kwara' },
  { code: 'LA', name: 'Lagos' },
  { code: 'NA', name: 'Nasarawa' },
  { code: 'NI', name: 'Niger' },
  { code: 'OG', name: 'Ogun' },
  { code: 'ON', name: 'Ondo' },
  { code: 'OS', name: 'Osun' },
  { code: 'OY', name: 'Oyo' },
  { code: 'PL', name: 'Plateau' },
  { code: 'RI', name: 'Rivers' },
  { code: 'SO', name: 'Sokoto' },
  { code: 'TA', name: 'Taraba' },
  { code: 'YO', name: 'Yobe' },
  { code: 'ZA', name: 'Zamfara' },
];
