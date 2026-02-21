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
import { useRouter } from "next/navigation";

interface StoreSettingsFormProps {
  initialData: FullStoreData;
}

export function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  console.log("🎨 STORE SETTINGS FORM INITIAL DATA:", {
    banner: initialData.banner,
    banner_id: initialData.banner_id,
    gravatar: initialData.gravatar,
    gravatar_id: initialData.gravatar_id
  });

  const form = useForm<StoreSettingsUpdate>({
    resolver: zodResolver(storeSettingsUpdateSchema),
    defaultValues: {
      store_name: initialData.store_name || "",
      phone: initialData.phone || "",
      banner: initialData.banner || "",
      banner_id: initialData.banner_id || 0,
      gravatar: initialData.gravatar || "",
      gravatar_id: initialData.gravatar_id || 0,
      address: (Array.isArray(initialData.address) && initialData.address.length === 0) ? {} : (initialData.address || {}),
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
        router.refresh();
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl space-y-8 pb-10">
      {/* Basic Information Section */}
      <StoreBasicInfoSection form={form} />

      {/* Address Section */}
      <StoreAddressSection form={form} />

      {/* Company & Financial Section */}
      <StoreCompanySection form={form} />

      {/* Policies & Content Section */}
      <StorePoliciesSection form={form} />

      {/* Submit Button */}
      <div className="flex justify-end gap-4 sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-xl border shadow-sm z-10">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSaving}
        >
          Reset Changes
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white min-w-[150px]"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
