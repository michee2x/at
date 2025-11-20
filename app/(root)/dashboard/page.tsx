// app/(root)/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import Image from "next/image";

export default async function DashboardPage() {
  // Automatically uses your NextAuth route configuration
  const session = await getServerSession();

  return (
    <div className="p-8 w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {session?.user ? (
        <div className="flex items-center gap-4">
          {/* Greeting */}
          <p className="text-lg">Welcome, {session.user.name}</p>
        </div>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}
