"use server";

import { Home, MapPin, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { getCustomerData, type Address } from "@/lib/actions/dashboard/customer";

function hasAddress(address?: Address | null) {
  if (!address) return false;
  const { first_name, last_name, address_1, city, state, postcode, phone, email } =
    address;
  return Boolean(
    first_name ||
      last_name ||
      address_1 ||
      city ||
      state ||
      postcode ||
      phone ||
      email
  );
}

function AddressLines({ address }: { address: Address }) {
  const lines: string[] = [];

  const fullName = [address.first_name, address.last_name]
    .filter(Boolean)
    .join(" ");
  if (fullName) lines.push(fullName);

  if (address.company) lines.push(address.company);
  if (address.address_1) lines.push(address.address_1);
  if (address.address_2) lines.push(address.address_2);

  const cityLine = [address.city, address.state, address.postcode]
    .filter(Boolean)
    .join(", ");
  if (cityLine) lines.push(cityLine);

  if (address.country) lines.push(address.country);
  if (address.phone) lines.push(`Phone: ${address.phone}`);
  if (address.email) lines.push(`Email: ${address.email}`);

  if (!lines.length) {
    return (
      <p className="text-sm text-gray-500 italic">
        You have not set up this type of address yet.
      </p>
    );
  }

  return (
    <div className="text-sm text-gray-700 leading-relaxed space-y-1">
      {lines.map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  );
}

export default async function AddressesPage() {
  const customer = await getCustomerData();
  const billing = customer?.billing ?? null;
  const shipping = customer?.shipping ?? null;

  const hasBilling = hasAddress(billing);
  const hasShipping = hasAddress(shipping);

  return (
    <div>
      {/* Page intro */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Addresses</h1>
        <p className="mt-1 text-sm text-gray-600">
          The following addresses will be used on the checkout page by default.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-[#6a00f3]" />
              <h2 className="text-lg font-medium text-gray-900">
                Billing address
              </h2>
            </div>

            <Link
              href="/my-account/addresses/billing/"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#6a00f3] hover:underline"
            >
              <Pencil className="w-4 h-4" />
              {hasBilling ? "Edit" : "Add"}
            </Link>
          </div>

          {hasBilling ? (
            <AddressLines address={billing!} />
          ) : (
            <p className="text-sm text-gray-500 italic">
              You have not set up this type of address yet.
            </p>
          )}
        </div>

        {/* Shipping Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6a00f3]" />
              <h2 className="text-lg font-medium text-gray-900">
                Shipping address
              </h2>
            </div>

            <Link
              href="/my-account/addresses/shipping"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#6a00f3] hover:underline"
            >
              {hasShipping ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {hasShipping ? "Edit" : "Add"}
            </Link>
          </div>

          {hasShipping ? (
            <AddressLines address={shipping!} />
          ) : (
            <p className="text-sm text-gray-500 italic">
              You have not set up this type of address yet.
            </p>
          )}
        </div>
      </div>

      {/* Combined summary section */}
      {(hasBilling || hasShipping) && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Saved addresses</h2>
          <p className="text-sm text-gray-600">
            Here&apos;s a quick view of the addresses linked to your Atlaze account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasBilling && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Billing
                </p>
                <AddressLines address={billing!} />
              </div>
            )}

            {hasShipping && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Shipping
                </p>
                <AddressLines address={shipping!} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
