import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route"; // adjust path if needed

export async function getSession() {
  return await getServerSession(authOptions);
}
