"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type VendorProduct } from "@/lib/actions/vendor/profile";
import { VendorProductList } from "./tabs/VendorProductList";
import { VendorReviews } from "./tabs/VendorReviews";
import { VendorBio } from "./tabs/VendorBio";

interface VendorTabsProps {
  vendorId: number;
  vendorBio?: string;
  initialProducts: VendorProduct[];
}

export function VendorTabs({ vendorId, vendorBio, initialProducts }: VendorTabsProps) {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 mb-8">
        <TabsTrigger 
          value="products"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-violet-600 data-[state=active]:text-violet-600 data-[state=active]:shadow-none px-0 py-3 font-medium bg-transparent hover:text-violet-600 transition-colors"
        >
          Products
        </TabsTrigger>
        <TabsTrigger 
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-violet-600 data-[state=active]:text-violet-600 data-[state=active]:shadow-none px-0 py-3 font-medium bg-transparent hover:text-violet-600 transition-colors"
        >
          Reviews
        </TabsTrigger>
        <TabsTrigger 
          value="bio"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-violet-600 data-[state=active]:text-violet-600 data-[state=active]:shadow-none px-0 py-3 font-medium bg-transparent hover:text-violet-600 transition-colors"
        >
          Vendor Biography
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-0 focus-visible:outline-none ring-offset-0">
        <VendorProductList initialProducts={initialProducts} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-0 focus-visible:outline-none ring-offset-0">
        <VendorReviews vendorId={vendorId} />
      </TabsContent>

      <TabsContent value="bio" className="mt-0 focus-visible:outline-none ring-offset-0">
        <VendorBio bio={vendorBio} />
      </TabsContent>
    </Tabs>
  );
}

