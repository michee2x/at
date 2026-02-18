import { Suspense } from "react";
import ReturnRequestsPage from "@/components/dashboard/return-requests/ReturnRequestsPage";
import { ReturnRequestsTableSkeleton } from "@/components/dashboard/return-requests/ReturnRequestsTableSkeleton";

export const metadata = {
  title: "Return Requests - Dashboard",
  description: "Manage and track all your return and warranty requests",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default function Page() {
  return (
    <Suspense fallback={<ReturnRequestsTableSkeleton />}>
      <ReturnRequestsPage />
    </Suspense>
  );
}
