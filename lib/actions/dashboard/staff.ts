"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";
import { revalidatePath } from "next/cache";

export interface VendorStaff {
  ID: string;
  user_login: string;
  user_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  display_name: string;
  user_registered: string;
  registered_at: string;
  avatar: string;
  capabilities: Record<string, boolean>;
}

export async function getVendorStaff() {
  try {
    const staff = await dokanRequest<VendorStaff[]>({
      endpoint: "vendor-staff",
      method: "GET",
    });
    return staff;
  } catch (error) {
    console.error("Error fetching vendor staff:", error);
    return [];
  }
}

export async function createVendorStaff(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}) {
  try {
    const newStaff = await dokanRequest<VendorStaff>({
      endpoint: "vendor-staff",
      method: "POST",
      body: {
        ...data,
        username: data.email.split('@')[0] + Math.floor(Math.random() * 1000), // Simple username generation
      },
    });
    revalidatePath("/dashboard/staff");
    return { success: true, data: newStaff };
  } catch (error: any) {
    console.error("Error creating vendor staff:", error);
    return { success: false, error: error.message };
  }
}

export async function updateVendorStaff(id: number, data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}) {
  try {
    // The endpoint for update might look like vendor-staff/:id
    const updatedStaff = await dokanRequest<VendorStaff>({
      endpoint: `vendor-staff/${id}`,
      method: "PUT", // or PATCH, depending on API
      body: data,
    });
    revalidatePath("/dashboard/staff");
    return { success: true, data: updatedStaff };
  } catch (error: any) {
    console.error("Error updating vendor staff:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteVendorStaff(id: number) {
  try {
    await dokanRequest({
      endpoint: `vendor-staff/${id}`,
      method: "DELETE",
    });
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting vendor staff:", error);
    return { success: false, error: error.message };
  }
}

export async function getStaffPermissions(staffId: number) {
  try {
    const staff = await dokanRequest<VendorStaff>({
      endpoint: `vendor-staff/${staffId}`,
      method: "GET",
    });
    return { success: true, capabilities: staff.capabilities };
  } catch (error: any) {
    console.error("Error fetching staff permissions:", error);
    return { success: false, error: error.message, capabilities: {} };
  }
}

export async function updateStaffPermissions(
  staffId: number,
  capabilities: Record<string, boolean>
) {
  try {
    // Transform capabilities object to array format required by API
    const capabilitiesArray = Object.entries(capabilities).map(([capability, access]) => ({
      capability,
      access,
    }));
    
    console.log("Updating staff permissions:", { staffId, capabilitiesArray });

    const response = await dokanRequest({
      endpoint: `vendor-staff/${staffId}/capabilities`,
      method: "PUT",
      body: { capabilities: capabilitiesArray },
    });

    console.log("Update response:", response);
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating staff permissions:", error);
    return { success: false, error: error.message };
  }
}
