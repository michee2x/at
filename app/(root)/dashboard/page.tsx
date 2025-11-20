// app/(root)/dashboard/page.tsx
import { getServerSession } from "next-auth/next";

export default async function DashboardPage() {
  // getServerSession automatically uses your NextAuth route configuration
  const session = await getServerSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {session?.user ? (
        <p>Welcome, {session.user.name}</p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}
