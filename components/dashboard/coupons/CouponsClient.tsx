"use client";

import { useState } from "react";
import { DokanCoupon } from "@/lib/actions/dashboard/coupons";
import { CouponsTable } from "@/components/dashboard/coupons/CouponsTable";
import { AddCouponModal } from "@/components/dashboard/coupons/AddCouponModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CouponsClientProps {
  initialCoupons: DokanCoupon[];
}

export function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const [search, setSearch] = useState("");

  const filteredCoupons = initialCoupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <AddCouponModal />
      </div>

      <CouponsTable coupons={filteredCoupons} />
    </div>
  );
}
