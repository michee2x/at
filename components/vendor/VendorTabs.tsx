"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getVendorProducts, getVendorReviews, type VendorProduct, type VendorReview } from "@/lib/actions/vendor/profile";
import Image from "next/image";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VendorTabsProps {
  vendorId: number;
  vendorBio?: string;
}

export function VendorTabs({ vendorId, vendorBio }: VendorTabsProps) {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const result = await getVendorProducts(vendorId);
    if (result.success) {
      setProducts(result.data);
    }
    setLoadingProducts(false);
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    const result = await getVendorReviews(vendorId);
    if (result.success) {
      setReviews(result.data);
    }
    setLoadingReviews(false);
  };

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="reviews" onClick={() => !reviews.length && loadReviews()}>
          Reviews
        </TabsTrigger>
        <TabsTrigger value="bio">Vendor Biography</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter product name"
              className="flex-1"
            />
            <Select defaultValue="default">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default sorting</SelectItem>
                <SelectItem value="popularity">Sort by popularity</SelectItem>
                <SelectItem value="rating">Sort by rating</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default" className="bg-violet-600 hover:bg-violet-700">
              Search
            </Button>
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="text-center py-12">Loading products...</div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-600">No products found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-violet-600 font-bold text-xl">
                      ₦{parseFloat(product.price).toFixed(2)}
                    </p>
                    <Button className="w-full mt-4 bg-black hover:bg-gray-800">
                      Read more
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        {loadingReviews ? (
          <div className="text-center py-12">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              No reviews yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.reviewer}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.date_created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="bio">
        <Card>
          <CardContent className="p-6">
            {vendorBio ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: vendorBio }}
              />
            ) : (
              <p className="text-gray-600 text-center py-12">No biography available</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
