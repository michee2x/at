// lib/auth.ts
import { getServerSession } from "next-auth/next";

export async function getSession() {
  return await getServerSession(); // automatically uses your [...nextauth]/route.ts
}
