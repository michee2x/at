"use server";

import Link from "next/link";

export default async function SupportTicketsPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Support tickets
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Get help with your orders, account or products. Support tickets let
          you keep all conversations with Atlaze in one place.
        </p>
      </div>

      {/* Empty state card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6a00f3]/10 text-[#6a00f3] text-lg font-semibold">
          ?
        </div>

        <p className="text-base font-medium text-gray-900 mb-1">
          Support tickets are not available yet
        </p>
        <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
          We&apos;re working on an in-dashboard ticket system where you&apos;ll
          be able to open, track, and reply to support conversations directly
          from your Atlaze account.
        </p>

        <p className="text-sm text-gray-600 mb-4">
          For now, if you need help with an order or your account, please reach
          out via email and we&apos;ll respond as quickly as possible.
        </p>

        <Link
          href="mailto:support@atlaze.com"
          className="inline-flex items-center rounded-full bg-[#6a00f3] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a00d0] transition"
        >
          Email Atlaze support
        </Link>
      </div>
    </div>
  );
}
