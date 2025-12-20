"use server";

import { getCustomerData } from "@/lib/actions/dashboard/customer";

export default async function PaymentPage() {
  const customer = await getCustomerData();

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment methods
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Atlaze uses Paystack to process your payments securely. We don&apos;t
          store your card details on our servers.
        </p>
      </div>

      {/* Primary payment method card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 aspect-square rounded-full bg-[#6a00f3]/10 flex items-center justify-center text-xs font-semibold text-[#6a00f3]">
              ₦
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Paystack (Cards, Bank, USSD &amp; more)
              </p>
              <p className="text-xs text-gray-500">
                Your payments are handled by Paystack with PCI-DSS compliant
                security.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100">
              Default payment method
            </span>
            {customer?.email && (
              <span>
                Atlaze account email:{" "}
                <span className="font-medium text-gray-800">
                  {customer.email}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-0 text-xs text-gray-500 max-w-xs">
          You can choose Paystack as your payment option during checkout. Card
          details are saved only with Paystack when you allow it; Atlaze never
          stores raw card numbers.
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
        <p className="mb-1 font-medium text-gray-800">Managing your cards</p>
        <p>
          At the moment, payment methods are managed directly on Paystack during
          checkout. If your card details change, simply choose Paystack at
          checkout again and follow the steps to update your payment method.
        </p>
      </div>
    </div>
  );
}
