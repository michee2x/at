import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";

const WP_URL = process.env.WC_API_URL!;

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.wpToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();

        // Validate minimal fields?
        if (!body.name) {
            return new NextResponse("Product Name is required", { status: 400 });
        }

        // Proxy to Dokan API
        // Endpoint: /wp-json/dokan/v1/products
        const res = await fetch(`${WP_URL}/wp-json/dokan/v1/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.wpToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[API] Dokan Create Product Error:", res.status, errorText);
            return new NextResponse(`Vendor API Error: ${errorText}`, { status: res.status });
        }

        const product = await res.json();
        return NextResponse.json(product);

    } catch (error) {
        console.error("[API] Error creating vendor product:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
