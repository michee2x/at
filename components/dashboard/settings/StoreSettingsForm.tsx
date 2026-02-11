"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storeSettingsUpdateSchema, type StoreSettingsUpdate } from "@/lib/schemas/store-settings";
import { updateStoreSettings, type FullStoreData } from "@/lib/actions/dashboard/settings";
import { StoreBasicInfoSection } from "./StoreBasicInfoSection";
import { StoreAddressSection } from "./StoreAddressSection";
import { StoreCompanySection } from "./StoreCompanySection";
import { StorePoliciesSection } from "./StorePoliciesSection";
import { Separator } from "@/components/ui/separator";

interface StoreSettingsFormProps {
  initialData: FullStoreData;
}

export function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<StoreSettingsUpdate>({
    resolver: zodResolver(storeSettingsUpdateSchema),
    defaultValues: {
      store_name: initialData.store_name || "",
      phone: initialData.phone || "",
      banner: initialData.banner || "",
      banner_id: initialData.banner_id || 0,
      gravatar: initialData.gravatar || "",
      gravatar_id: initialData.gravatar_id || 0,
      address: initialData.address || [],
      company_name: initialData.company_name || "",
      company_id_number: initialData.company_id_number || "",
      vat_number: initialData.vat_number || "",
      bank_name: initialData.bank_name || "",
      bank_iban: initialData.bank_iban || "",
      vendor_biography: initialData.vendor_biography || "",
      show_email: initialData.show_email || false,
      toc_enabled: initialData.toc_enabled || false,
      store_toc: initialData.store_toc || "",
      social: initialData.social || {},
    },
  });

  const onSubmit = async (data: StoreSettingsUpdate) => {
    setIsSaving(true);
    try {
      const result = await updateStoreSettings(data);
      
      if (result.success) {
        toast.success(result.message || "Store settings updated successfully!");
        // Optionally refresh the page or update local state
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to update store settings");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white max-w-4xl space-y-8">
      {/* Basic Information Section */}
      <StoreBasicInfoSection form={form} />

      <Separator />

      {/* Address Section */}
      <StoreAddressSection form={form} />

      <Separator />

      {/* Company & Financial Section */}
      <StoreCompanySection form={form} />

      <Separator />

      {/* Policies & Content Section */}
      <StorePoliciesSection form={form} />

      {/* Submit Button */}
      <div className="pt-6 flex gap-4">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSaving}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
