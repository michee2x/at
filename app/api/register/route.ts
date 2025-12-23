// app/api/register/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { WooClient } from "../../../lib/wooClient";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface WooCustomerPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  username: string;
  password: string;
}

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
// ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ─────────────────────────────────────────────────────────────
// ERROR MESSAGES
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// POST ROUTE
// ─────────────────────────────────────────────────────────────

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

    // Prepare payload
    const payload: WooCustomerPayload = {
      email: parsed.data.email,
      username: parsed.data.email.split("@")[0],
      password: parsed.data.password,
    };

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
