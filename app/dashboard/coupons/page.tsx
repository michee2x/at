import { Suspense } from "react";
import { getVendorCoupons } from "@/lib/actions/dashboard/coupons";
import { CouponsClient } from "@/components/dashboard/coupons/CouponsClient";
import { CouponsTableSkeleton } from "@/components/dashboard/coupons/CouponsTableSkeleton";
import { X } from "lucide-react";

export default async function CouponsPage() {
  const coupons = await getVendorCoupons();

  return (
    <div className="space-y-6">
      {/* Banner from screenshot */}
      <div className="relative rounded-lg border border-primary/20 bg-primary/10 p-4 text-primary">
        <div className="flex items-center gap-3">
          Start with adding a Banner to gain profile progress
        </div>
        <button className="absolute right-4 top-4 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span className="text-primary font-medium cursor-pointer border-b-2 border-primary pb-1">My Coupons</span>
            <span className="cursor-pointer hover:text-foreground">Marketplace Coupons</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<CouponsTableSkeleton />}>
        <CouponsClient initialCoupons={coupons} />
      </Suspense>
    </div>
  );
}
