import React from "react";
import { WooProductReview } from "@/types";
import { Ratings } from "@/components/Ratings";
import { format } from "date-fns";
import Image from "next/image";

interface ReviewListProps {
  reviews: WooProductReview[];
}

// Helper to generate consistent colors based on name
function getAvatarColor(name: string) {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-poppins text-sm">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const hasAvatar = review.avatar_urls && Object.values(review.avatar_urls).some(url => url && !url.includes("gravatar.com/avatar/?d=mm"));
        
        return (
        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] font-poppins transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`shrink-0 relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-sm ${getAvatarColor(review.reviewer)}`}>
                <span>{getInitials(review.reviewer)}</span>
                {hasAvatar && (
                    <Image 
                      src={review.avatar_urls?.["96"] || ""} 
                      alt={review.reviewer}
                      fill
                      className="object-cover"
                    />
                )}
            </div>

            {/* Header & Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{review.reviewer}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                       <Ratings rating={review.rating} starSize={13} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full w-fit">
                      {format(new Date(review.date_created), "MMM d, yyyy")}
                  </span>
              </div>
              
              <div 
                  className="text-[14px] text-gray-600 leading-[1.7] mt-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: review.review }} 
              />
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
