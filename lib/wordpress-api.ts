import { getSession } from "next-auth/react";

/**
 * Fetch data from WordPress using the authenticated user's WP JWT token.
 * specific to Client Components or client-side logic.
 * 
 * For Server Components, use getServerSession(authOptions) to get the token directly.
 */
export async function fetchFromWordPress(endpoint: string, options: RequestInit = {}) {
    const session = await getSession();

    // Use public variable for client-side availability, or fallback to server var
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WC_API_URL || "";
    const cleanUrl = baseUrl.replace(/\/$/, "");

    const response = await fetch(
        `${cleanUrl}${endpoint}`,
        {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.wpToken}`, // WordPress JWT
                ...(options.headers || {}),
            },
        }
    );

    if (!response.ok) {
        const body = await response.text();
        try {
            const json = JSON.parse(body);
            throw new Error(json.message || json.error || `Request failed: ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed: ${response.status} ${body}`);
        }
    }

    return response.json();
}
