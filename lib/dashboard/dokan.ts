import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://atlaze.com";

interface DokanRequest {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
}

export async function dokanRequest<T>({
    endpoint,
    method = "GET", // Default behavior
    body,
}: DokanRequest): Promise<T> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized: No session found");
    }

    // Access the WP JWT token from the session
    // We explicitly cast to any because the session type augmentation might not be picked up here
    const wpToken = (session as any)?.wpToken;

    if (!wpToken) {
        console.error("Dokan API Error: No WP Token found in session");
        throw new Error("Unauthorized: No WordPress Token");
    }

    const url = `${WC_API_URL}/wp-json/dokan/v1/${endpoint}`;

    console.log(`Dokan Request: ${method} ${url}`);

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${wpToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store", // Ensure fresh data for orders
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Dokan API Error (${response.status}):`, errorText);
        throw new Error(`Dokan API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
