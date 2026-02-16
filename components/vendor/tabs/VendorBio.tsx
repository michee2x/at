"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface VendorBioProps {
  bio?: string;
}

export function VendorBio({ bio }: VendorBioProps) {
  if (!bio) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-dashed">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No biography available</h3>
        <p className="text-sm text-gray-500 mt-1">
          This vendor hasn't provided a biography yet.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div 
            className="prose prose-violet max-w-none prose-img:rounded-lg prose-headings:text-gray-900 prose-p:text-gray-600"
            dangerouslySetInnerHTML={{ __html: bio }} 
        />
      </CardContent>
    </Card>
  );
}
