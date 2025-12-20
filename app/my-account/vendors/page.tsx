import React from "react";
import { Vendor, VendorCard } from "@/components/account/VendorCard";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock Data
const MOCK_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "Tech Haven Official",
    slug: "tech-haven",
    banner: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2601&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 1250,
    address: "Computer Village, Ikeja, Lagos",
    isFollowing: true,
  },
  {
    id: "2",
    name: "Luxe Fashion House",
    slug: "luxe-fashion",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1600609842365-d6d7be268f71?q=80&w=1968&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 85,
    address: "Ademola Adetokunbo, Victoria Island",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Home & Beyond",
    slug: "home-beyond",
    banner: "https://images.unsplash.com/photo-1582234372727-31df0b89b884?q=80&w=2080&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1976&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 320,
    address: "Wuse 2, Abuja",
    isFollowing: true,
  },
];

const Vendors = () => {
  const vendors = MOCK_VENDORS; // In future, fetch this server-side or via API hook

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vendors</h1>
          <p className="text-gray-500 text-sm mt-1">Stores you currently follow</p>
        </div>
        <Link href="/stores">
           <Button variant="outline" className="hidden sm:flex border-gray-200">
             Find More Stores
           </Button>
        </Link>
      </div>

      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Store className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors followed yet</h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
                Follow stores to see their latest products and updates right here.
            </p>
            <Link href="/stores">
                <Button className="bg-[#6a00f3] hover:bg-[#5a00d3] text-white">
                    Explore Stores
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
};

export default Vendors;
