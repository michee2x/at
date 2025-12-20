"use server"

import { wooCommerceRequest } from "@/lib/dashboard/woocomerce";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export interface CustomerData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: Address;
  shipping: Address;
  meta_data: Array<{ key: string; value: string | number | boolean | null }>;
}

export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export async function getCustomerData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  try {
    return await wooCommerceRequest<CustomerData>({
      endpoint: `customers/${session.user.id}`,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export async function updateCustomerData(data: Partial<CustomerData>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await wooCommerceRequest<CustomerData>({
      endpoint: `customers/${session.user.id}`,
      method: "PUT",
      body: data,
    });

    revalidatePath("/dashboard/account");
    revalidatePath("/dashboard/addresses");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Failed to update customer data" };
  }
}