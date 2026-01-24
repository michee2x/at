import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const WP_URL = process.env.WC_API_URL!;

interface RouteParams {
    params: {
        id: string;
    }
}

// GET: Fetch single product for editing
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.wpToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const id = params.id;
        const url = `${WP_URL}/wp-json/dokan/v1/products/${id}`;
        console.log(`[API] Fetching product ${id} from ${url}`);
        
        // Fetch specific product by ID via Dokan/WC API
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.wpToken}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[API] Failed to fetch product ${id}: ${res.status} - ${errorText}`);
            if (res.status === 404) return new NextResponse("Product not found", { status: 404 });
            return new NextResponse(`Vendor API Error: ${errorText}`, { status: res.status });
        }

        const product = await res.json();
        console.log(`[API] Fetched product ${id} successfully`);
        return NextResponse.json(product);

    } catch (error) {
        console.error("[API] Error fetching product:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PUT: Update product
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.wpToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const id = params.id;
        const body = await request.json();

        // Use Dokan API for updates
        const res = await fetch(`${WP_URL}/wp-json/dokan/v1/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.wpToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[API] Product Update Error:", res.status, errorText);
            return new NextResponse(`Failed to update: ${errorText}`, { status: res.status });
        }

        const updatedProduct = await res.json();
        return NextResponse.json(updatedProduct);

    } catch (error) {
        console.error("[API] Error updating product:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE: Remove product
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.wpToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const id = params.id;

        // Use Standard WC API for deletion as Dokan sometimes maps differently
        // /wc/v3/products/{id}?force=true
        const res = await fetch(`${WP_URL}/wp-json/wc/v3/products/${id}?force=true`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.wpToken}`,
            },
        });

        if (!res.ok) {
             const errorText = await res.text();
             console.error("[API] Product Delete Error:", res.status, errorText);
             return new NextResponse(`Failed to delete: ${errorText}`, { status: res.status });
        }

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error("[API] Error deleting product:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
