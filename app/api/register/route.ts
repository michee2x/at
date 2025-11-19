// app/api/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { WooClient } from "../../../lib/wooClient";

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    // Prepare payload for WooCommerce customer creation
    const payload = {
      email: parsed.email,
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      username: parsed.username || parsed.email.split("@")[0],
      password: parsed.password,
    };

    const created = await WooClient.createCustomer(payload);

    // Return created customer object
    return NextResponse.json({ success: true, customer: created }, { status: 201 });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ success: false, message: err.message || "Error" }, { status: 400 });
  }
}
