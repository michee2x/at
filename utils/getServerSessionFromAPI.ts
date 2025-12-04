import { cookies } from "next/headers"; // important!


export async function getServerSessionFromAPI() {
  const cookieStore = await cookies(); // ✅ await it
  const sessionCookie = cookieStore.get("next-auth.session-token"); // now .get exists
  const cookieHeader = sessionCookie?.value ?? "";

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie: cookieHeader ? `${process.env.NEXTAUTH_URL === "http://localhost:3000" ? "next-auth.session-token":"__Secure-next-auth.session-token"}=${cookieHeader}` : "",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}