"use client";

import { useTransition } from "react";
import { Review } from "@/lib/actions/dashboard/reviews";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface StatusTab {
    label: string;
    value: string;
    count?: number; 
}

interface ReviewTabsProps {
    tabs: StatusTab[];
    activeTab: string;
    onTabChange: (value: string) => void;
    isLoading: boolean;
}

export function ReviewTabs({ tabs, activeTab, onTabChange, isLoading }: ReviewTabsProps) {
    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        disabled={isLoading}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === tab.value
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
                    </button>
                ))}
            </nav>
        </div>
    );
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No reviews found.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-2 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">AUTHOR</div>
                <div className="col-span-6">REVIEW</div>
                <div className="col-span-3">RATING</div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        {/* Author */}
                        <div className="col-span-3">
                            <div className="text-sm font-medium text-purple-600">{review.name}</div>
                            <div className="text-xs text-gray-500">{review.email}</div>
                        </div>

                        {/* Review Content */}
                        <div className="col-span-6 pr-4">
                            <div className="text-sm text-gray-600 mb-1">{review.review}</div> {/* Currently simple text, might need HTML parsing if API returns HTML */}
                            <div className="text-xs text-gray-400">
                                {format(new Date(review.date_created), "M/d/yyyy")}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="col-span-3 flex items-center">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                            star <= review.rating
                                                ? "text-purple-600 fill-purple-600"
                                                : "text-gray-300 fill-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
