import { Suspense } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        {/* Sidebar is only visible on desktop here; on mobile it's shown via the header sheet */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 lg:ml-80">
          <div className="container min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-display max-w-6xl py-8 px-4 md:px-6 lg:px-8">
            <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AtlazeLoader />
    </div>
  );
}
