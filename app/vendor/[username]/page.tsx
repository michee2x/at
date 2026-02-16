import { notFound } from "next/navigation";
import { getVendorByUsername } from "@/lib/actions/vendor/profile";
import { VendorHeader } from "@/components/vendor/VendorHeader";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { VendorTabs } from "@/components/vendor/VendorTabs";

interface VendorPageProps {
  params: {
    username: string;
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { username } = params;
  const result = await getVendorByUsername(username);

  if (!result.success || !result.data) {
    notFound();
  }

  const vendor = result.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendor={vendor} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <VendorSidebar vendor={vendor} />
          </aside>
          
          <main className="lg:col-span-3">
            <VendorTabs vendorId={vendor.id} vendorBio={vendor.vendor_biography} />
          </main>
        </div>
      </div>
    </div>
  );
}
