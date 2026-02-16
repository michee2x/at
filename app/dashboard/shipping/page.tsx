import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shipping</h1>
        <Link href="/vendor/shipping" target="_blank" className="text-violet-600 hover:text-violet-700">
          <ExternalLink className="h-5 w-5" />
        </Link>
      </div>

      {/* Banner to add shipping policies */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-blue-800">Add Banner to gain 15% progress</p>
          <Link href="/dashboard/settings/shipping">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              Click here to add Shipping Policies
            </Button>
          </Link>
        </div>
      </div>

      {/* Shipping Zone Description */}
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">
            A shipping zone is a geographic region where a certain set of shipping methods are offered. 
            We will match a customer to a single zone using their shipping address and present the shipping 
            methods within that zone to them.
          </p>
          <p className="text-muted-foreground">
            If you want to use the previous shipping system then{" "}
            <Link href="#" className="text-violet-600 hover:underline font-semibold">
              Click Here
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Shipping Zones Table */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 font-semibold text-sm border-b pb-2">
              <div>ZONE NAME</div>
              <div>REGIONS</div>
              <div>SHIPPING METHODS</div>
              <div>ACTIONS</div>
            </div>
            
            {/* Empty state or zones would go here */}
            <div className="text-center py-12 text-muted-foreground">
              <p>No shipping zones configured yet.</p>
              <p className="text-sm mt-2">
                Customer to a single zone using their shipping address and present the shipping methods within that zone to them.
              </p>
              <p className="text-sm mt-4">
                If you want to use the previous shipping system then{" "}
                <Link href="#" className="text-violet-600 hover:underline">
                  Click Here
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
