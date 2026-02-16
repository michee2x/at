import { Metadata } from "next";
import { StoreSEOSection } from "@/components/dashboard/settings/StoreSEOSection";
import { getStoreSeoSettings } from "@/lib/actions/dashboard/seo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Store SEO | Dashboard",
  description: "Manage your store SEO settings",
};

export default async function StoreSEOPage() {
  const result = await getStoreSeoSettings();

  if (!result.success) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {result.message || "Failed to load SEO settings. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Engine Optimization</h1>
        <p className="text-gray-500 mt-2">
          Optimize your store for search engines and social media networks.
        </p>
      </div>
      
      <StoreSEOSection initialData={result.data || {}} />
    </div>
  );
}
