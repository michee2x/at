"use client";

import { useState, useEffect } from "react";
import { getReviews, Review } from "@/lib/actions/dashboard/reviews";
import { ReviewTabs, ReviewList } from "@/components/dashboard/reviews/ReviewPageComponents";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsPage() {
    const [activeTab, setActiveTab] = useState("approved");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // We can store counts here. 
    // Ideally we'd fetch all counts at once or cache them.
    // For now, valid strategy is to fetch current tab data.
    // To show counts on tabs without visiting them, we might need a separate 'stats' call or parallel fetch.
    // The user requirement didn't explicitly ask for all counts to load immediately, but the UI shows "(1) (0)..."
    // I will try to fetch counts or just default them to 0 until loaded.
    // Actually, if we want counts, we might need to make parallel calls for each status or use a summary endpoint if available.
    // "Dokan" API usually doesn't give a summary in the list endpoint.
    // I will implement a mechanism to fetch counts.
    
    // Simplification: We will just show the count for the CURRENT tab if we get it from headers.
    // Or we can try to fetch all counts on mount (might be 4 requests).
    // Let's stick to simple first: standard loading.
    
    const [counts, setCounts] = useState<{ [key: string]: number }>({
        approved: 0,
        pending: 0,
        spam: 0,
        trash: 0
    });

    useEffect(() => {
        fetchReviews(activeTab);
        // On mount, we might want to fetch counts for all? 
        // Let's just fetch current for now to be fast.
        // Actually the UI shows counts for all tabs. 
        // I will initiate a background fetch for all counts.
        fetchAllCounts();
    }, []); // Run on mount

    useEffect(() => {
        fetchReviews(activeTab);
    }, [activeTab]);

    const fetchAnyStatusCount = async (status: string) => {
        try {
            const data = await getReviews(status, 1, 1); // Get 1 item just to read headers
            return data.totalCount;
        } catch (e) {
            return 0;
        }
    };

    const fetchAllCounts = async () => {
        const statuses = ["approved", "pending", "spam", "trash"];
        const newCounts = { ...counts };
        
        await Promise.all(statuses.map(async (status) => {
            const count = await fetchAnyStatusCount(status);
            newCounts[status as keyof typeof newCounts] = count;
        }));
        setCounts(newCounts);
    };

    const fetchReviews = async (status: string) => {
        setIsLoading(true);
        try {
            const data = await getReviews(status);
            setReviews(data.reviews);
            // Update count for current status from the source of truth
            setCounts(prev => ({
                ...prev,
                [status]: data.totalCount
            }));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reviews</h1>

            <div className="bg-white rounded-lg p-6 min-h-[400px]">
                <ReviewTabs 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange}
                    isLoading={isLoading}
                    tabs={[
                        { label: "Approved", value: "approved", count: counts.approved },
                        { label: "Pending", value: "pending", count: counts.pending },
                        { label: "Spam", value: "spam", count: counts.spam },
                        { label: "Trash", value: "trash", count: counts.trash },
                    ]}
                />

                {isLoading ? (
                     <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                ) : (
                    <ReviewList reviews={reviews} />
                )}
            </div>
        </div>
    );
}
