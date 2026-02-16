import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getShippingPolicy } from "@/lib/actions/dashboard/shipping";
import { ShippingPolicyForm } from "@/components/dashboard/settings/ShippingPolicyForm";

export default async function ShippingSettingsPage() {
  const { data: policyData } = await getShippingPolicy();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Shipping Policy</h1>
             <Link href="/vendor/shipping-policy" target="_blank" className="text-violet-600 hover:text-violet-700">
                <ExternalLink className="h-5 w-5" />
            </Link>
        </div>
       
        <Link href="/dashboard/shipping">
            <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground mb-4">
          A shipping zone is a geographic region where a certain set of shipping methods are offered. We will match a customer to a single zone using their shipping address and present the shipping methods within that zone to them.
        </p>
        <div className="p-4 bg-violet-50 rounded-md border border-violet-100">
            <p className="text-sm text-violet-800">
                If you want to use the previous shipping system then{" "}
                <Link href="#" className="font-semibold underline hover:text-violet-900">
                    Click Here
                </Link>
            </p>
        </div>
      </div>

      <ShippingPolicyForm initialData={policyData} />
    </div>
  );
}

