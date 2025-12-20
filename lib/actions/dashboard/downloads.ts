"use server"

import { wooCommerceRequest } from "@/lib/dashboard/woocomerce";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface Download {
  download_id: string;
  download_name: string;
  product_id: number;
  product_name: string;
  download_url: string;
  downloads_remaining: string;
  access_expires: string;
}

export async function getDownloads() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  try {
    const customer = await wooCommerceRequest<{ downloads: Download[] }>({
      endpoint: `customers/${session.user.id}`,
    });

    return customer.downloads || [];
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return [];
  }
}