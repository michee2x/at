import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getVendorByUsername, getVendorProducts } from "@/lib/actions/vendor/profile";
import { isFollowingStore } from "@/lib/actions/store/follow";
import { VendorHeader } from "@/components/vendor/VendorHeader";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { VendorTabs } from "@/components/vendor/VendorTabs";

interface VendorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params;
  const result = await getVendorByUsername(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const vendor = result.data;
  
  // Get current user session to check for "Edit Profile" vs "Follow"
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;
  const isOwnProfile = currentUserId === vendor.id;
  
  let isFollowing = false;
  if (currentUserId && !isOwnProfile) {
    isFollowing = await isFollowingStore(vendor.id);
  }

  // Fetch products using the vendor ID from the API response
  const productsResult = await getVendorProducts(vendor.id, 1, 12);
  const products = productsResult.success ? productsResult.data : [];

  // Extract categories from products for the sidebar
  // We can do this from the already fetched products to save an API call
  // or use the dedicated helper if we need all categories across all pages
  const categoriesMap = new Map<number, { id: number; name: string; slug: string }>();
  products.forEach((product) => {
    product.categories?.forEach((cat) => {
      if (!categoriesMap.has(cat.id)) {
        categoriesMap.set(cat.id, { id: cat.id, name: cat.name, slug: cat.slug });
      }
    });
  });
  const categories = Array.from(categoriesMap.values());

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader 
        vendor={vendor} 
        isFollowing={isFollowing}
        isOwnProfile={isOwnProfile}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <aside className="lg:col-span-3">
            <VendorSidebar vendor={vendor} categories={categories} />
          </aside>
          
          <main className="lg:col-span-9">
            <VendorTabs 
              vendorId={vendor.id} 
              vendorBio={vendor.vendor_biography}
              initialProducts={products}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
