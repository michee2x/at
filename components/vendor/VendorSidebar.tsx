"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import type { VendorProfile } from "@/lib/actions/vendor/profile";

interface VendorSidebarProps {
  vendor: VendorProfile;
}

export function VendorSidebar({ vendor }: VendorSidebarProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact vendor functionality
    console.log("Contact vendor:", { name, email, message });
  };

  return (
    <div className="space-y-6">
      {/* Store Product Category */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Store Product Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="#" className="block text-violet-600 hover:text-violet-700 hover:underline text-sm">
            Cushion Covers
          </a>
          <a href="#" className="block text-violet-600 hover:text-violet-700 hover:underline text-sm">
            Curtains
          </a>
        </CardContent>
      </Card>

      {/* Contact Vendor */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Contact Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-sm font-medium">
                {vendor.first_name || "Name"}
              </Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={vendor.email || "your@email.com"}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-message" className="text-sm font-medium">
                Message
              </Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 h-9">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
