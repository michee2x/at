"use client";

import { useEffect, useState } from "react";
import { Star, User, Calendar, CheckCircle2 } from "lucide-react";
import { type VendorReview, getVendorReviews } from "@/lib/actions/vendor/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorReviewsProps {
  vendorId: number;
}

export function VendorReviews({ vendorId }: VendorReviewsProps) {
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0, counts: [0, 0, 0, 0, 0] });

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const result = await getVendorReviews(vendorId);
      if (result.success && result.data) {
        setReviews(result.data);
        calculateStats(result.data);
      }
      setLoading(false);
    };

    loadReviews();
  }, [vendorId]);

  const calculateStats = (reviewsData: VendorReview[]) => {
    if (!reviewsData.length) return;

    const counts = [0, 0, 0, 0, 0];
    let sum = 0;

    reviewsData.forEach(r => {
      const rating = Math.min(Math.max(Math.round(r.rating), 1), 5);
      counts[5 - rating]++; // 5 stars at index 0
      sum += r.rating;
    });

    setStats({
      average: sum / reviewsData.length,
      total: reviewsData.length,
      counts
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/6" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-dashed">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Star className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          This vendor hasn't received any reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Review Stats */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{stats.average.toFixed(1)}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on {stats.total} reviews</p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <div className="w-3 text-gray-600">{star}</div>
                  <Star className="h-3 w-3 text-gray-400" />
                  <Progress value={stats.total ? (stats.counts[index] / stats.total) * 100 : 0} className="h-2" />
                  <div className="w-8 text-right text-gray-500 text-xs">
                    {stats.counts[index]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review List */}
      <div className="lg:col-span-2 space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-violet-100 text-violet-700">
                        {review.reviewer.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate pr-2">
                      {review.reviewer}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.date_created).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
