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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Product Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-violet-600 hover:underline">
                Cushion Covers
              </a>
            </li>
            <li>
              <a href="#" className="text-violet-600 hover:underline">
                Curtains
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Contact Vendor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">{vendor.first_name || "Vendor Name"}</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact-email">{vendor.email || "vendor@example.com"}</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact-message">Type your message...</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
