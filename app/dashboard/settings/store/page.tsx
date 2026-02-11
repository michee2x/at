import { getStoreSettings } from "@/lib/actions/dashboard/settings";
import { StoreSettingsForm } from "@/components/dashboard/settings/StoreSettingsForm";
import { ProfileCompletionBanner } from "@/components/dashboard/ProfileCompletionBanner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function StoreSettingsPage() {
  const { success, data } = await getStoreSettings();
  
  if (!success || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your store information and preferences.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-destructive">Failed to load store settings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Completion Banner */}
      <ProfileCompletionBanner storeData={data} />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-normal text-gray-800 flex items-center gap-2 mb-1">
          Settings <ArrowRight className="h-6 w-6 text-gray-400" />
        </h1>
        <Link href={data.shop_url || "#"} className="text-purple-600 text-xl font-normal hover:underline">
          Visit Store
        </Link>
      </div>

      {/* Form */}
      <div className="border-t pt-6">
        <StoreSettingsForm initialData={data} />
      </div>
    </div>
  );
}
