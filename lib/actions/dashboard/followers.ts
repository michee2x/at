"use server";

import { dokanRequest } from "@/lib/dashboard/dokan";

export interface StoreFollower {
    id: number;
    user_id: number;
    date: string;
    name: string;
    avatar: string;
    email: string;
}

export async function getStoreFollowers() {
    try {
        // Assuming the endpoint for followers in Dokan (might need adjustment based on specific addon version)
        // Common endpoints: 'follow-store/followers', 'store-followers', or just 'followers'
        const response = await dokanRequest<any[]>({
            endpoint: "follow-store/followers",
            method: "GET",
        });

        console.log("Followers response:", response);

        return response.map((item: any) => ({
            id: item.id,
            user_id: item.user_id || 0,
            name: item.full_name || `${item.first_name} ${item.last_name}`,
            avatar: item.avatar_url,
            email: "", // Not provided in the default response
            date: item.followed_at,
        })) || [];
    } catch (error) {
        console.error("Error fetching store followers:", error);
        return [];
    }
}
