import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const WP_URL = process.env.WC_API_URL!;

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.wpToken) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to WordPress Media Library
        // Endpoint: /wp-json/wp/v2/media
        const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.wpToken}`,
                "Content-Disposition": `attachment; filename="${file.name}"`,
                "Content-Type": file.type,
            },
            body: buffer,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[API] Media Upload Error:", res.status, errorText);
            return new NextResponse(`Media API Error: ${errorText}`, { status: res.status });
        }

        const data = await res.json();

        // Return relevant data (ID, URL)
        return NextResponse.json({
            id: data.id,
            url: data.source_url,
        });

    } catch (error) {
        console.error("[API] Error uploading media:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
