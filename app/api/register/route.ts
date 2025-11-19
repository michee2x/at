// app/api/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { WooClient } from "../../../lib/wooClient";

// ------------------------------
// TYPES
// ------------------------------

interface WooCustomerPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  username: string;
  password: string;
}

interface WooError {
  message?: string;
}

// ------------------------------
// ZOD SCHEMA
// ------------------------------

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(8),
});

// ------------------------------
// POST ROUTE
// ------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const payload: WooCustomerPayload = {
      email: parsed.email,
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      username: parsed.username || parsed.email.split("@")[0],
      password: parsed.password,
    };

    const created = await WooClient.createCustomer(payload);

    return NextResponse.json(
      { success: true, customer: created },
      { status: 201 }
    );

  } catch (err: unknown) {
    const errorObj = err as WooError;

    console.error("Register error:", errorObj);

    return NextResponse.json(
      { success: false, message: errorObj.message || "Error" },
      { status: 400 }
    );
  }
}
