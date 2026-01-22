// app/api/register/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { WooClient } from "../../../lib/wooClient";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

// TYPES
interface WooCustomerPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  username: string;
  password: string;
  role?: string;
  meta_data?: Array<{ key: string; value: string }>;
}

// VALIDATION SCHEMA
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "seller"]).default("customer"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  shopName: z.string().optional(),
  shopUrl: z.string().optional(),
});

// ERROR MESSAGES
const ERROR_MESSAGES: Record<string, string> = {
  "registration-error-email-exists": "An account with this email already exists. Try logging in instead.",
  "registration-error-username-exists": "This username is already taken. Please try another.",
  "invalid_email": "Please enter a valid email address.",
  "rest_invalid_param": "Please check your information and try again.",
};

function getErrorMessage(errorBody: string): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (errorBody.includes(key)) {
      return message;
    }
  }
  return "Registration failed. Please try again later.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { email, password, role, firstName, lastName, phone, shopName, shopUrl } = parsed.data;

    // Prepare payload
    // IMPORTANT: 'seller' is the usual Dokan role slug. If this fails, try 'vendor'.
    const userRole = role === "seller" ? "seller" : "customer"; 

    const payload: WooCustomerPayload = {
      email,
      username: email.split("@")[0], // Username from email prefix
      password,
      first_name: firstName,
      last_name: lastName,
      role: userRole,
    };

    // If Vendor, add specific meta data
    if (role === "seller") {
      const slug = shopUrl || shopName?.toLowerCase().replace(/\s+/g, '-') || "";
      
      payload.meta_data = [
        { key: "billing_phone", value: phone || "" },
        { key: "dokan_store_name", value: shopName || "" },
        { key: "dokan_store_slug", value: slug },
        { key: "dokan_enable_selling", value: "yes" }, // Auto-enable selling
        
        // Dokan Profile Settings structure (basic)
        { 
          key: "dokan_profile_settings", 
          value: JSON.stringify({
            store_name: shopName,
            phone: phone,
            address: {}, // Initialize empty address to avoid errors
          }) 
        }
      ];
    }

    // Create customer in WooCommerce
    const created = await WooClient.createCustomer(payload);

    return NextResponse.json(
      { success: true, customer: created },
      { status: 201 }
    );

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const userFriendlyMessage = getErrorMessage(errorMessage);

    return NextResponse.json(
      { success: false, message: userFriendlyMessage },
      { status: 400 }
    );
  }
}
