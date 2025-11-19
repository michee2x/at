// app/account/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) return redirect("/login");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Account</h1>
      <p>Welcome, {session.user?.name || session.user?.email}</p>
      <p className="mt-4">Email: {session.user?.email}</p>
      {/* Add profile update forms or address book here */}
    </div>
  );
}
