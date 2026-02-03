"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";
import { revalidatePath } from "next/cache";

export async function followStore(vendorId: number) {
  try {
    const response = await dokanRequest({
      endpoint: "follow-store",
      method: "POST",
      body: { vendor_id: vendorId },
    });
    
    // Revalidate relevant paths
    revalidatePath(`/product/[id]`); 
    revalidatePath(`/dashboard/followers`);
    
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error following store:", error);
    return { success: false, error: error.message || "Failed to follow store" };
  }
}

export async function unfollowStore(vendorId: number) {
  try {
    // Some implementations use DELETE on the same endpoint or a specific unfollow endpoint
    // Trying DELETE with body or query param often works for partial REST implementations
    // Alternatively: POST /follow-store/unfollow
    
    // Strategy: Try DELETE on 'follow-store/{id}' if RESTful, or POST to 'follow-store' with action?
    // Dokan often distinguishes by method.
    
    const response = await dokanRequest({
      endpoint: `follow-store/${vendorId}`,
      method: "DELETE",
    });

    revalidatePath(`/product/[id]`);
    revalidatePath(`/dashboard/followers`);

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error unfollowing store:", error);
    return { success: false, error: error.message || "Failed to unfollow store" };
  }
}

export async function isFollowingStore(vendorId: number): Promise<boolean> {
   // This is tricky without a direct "check" endpoint.
   // Often we have to fetch the list of followed stores and check existence.
   // Or check if the user is in the vendor's follower list (expensive).
   // For now, we might rely on the client-side state or handle it via initial props if available.
   // Dokan API 2.9.15+ : GET /dokan/v1/follow-store/check/{vendor_id}
   
   try {
       const response = await dokanRequest<{ status: boolean }>({
           endpoint: `follow-store/check/${vendorId}`,
           method: "GET"
       });
       return response?.status === true;
   } catch (error) {
       console.error("Error checking follow status", error);
       return false;
   }
}
