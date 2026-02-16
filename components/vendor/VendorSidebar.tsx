"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import type { VendorProfile } from "@/lib/actions/vendor/profile";
import { sendVendorContactMessage } from "@/lib/actions/vendor/profile";
import { toast } from "react-toastify";

interface VendorSidebarProps {
  vendor: VendorProfile;
  categories?: { id: number; name: string; slug: string }[];
}

export function VendorSidebar({ vendor, categories = [] }: VendorSidebarProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendVendorContactMessage(vendor.id, { name, email, message });
      
      if (result.success) {
        toast.success("Message sent to vendor successfully!");
        // Reset form
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Product Category */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold">Store Product Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.length > 0 ? (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <a 
                  key={cat.id} 
                  href={`/search?category=${cat.slug}&vendor=${vendor.id}`} 
                  className="text-sm text-gray-600 hover:text-violet-600 hover:underline transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground italic">No specific categories found.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Vendor */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="p-3 pb-2 border-b border-gray-100">
          <CardTitle className="text-sm font-semibold">Contact Vendor</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="contact-name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="h-9 bg-gray-50 border-gray-200 focus-visible:ring-violet-500/20"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-9 bg-gray-50 border-gray-200 focus-visible:ring-violet-500/20"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
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
                className="resize-none bg-gray-50 border-gray-200 focus-visible:ring-violet-500/20"
                disabled={isSubmitting}
              />
            </div>

            <Button 
                type="submit" 
                className="w-full bg-violet-600 hover:bg-violet-700 h-9 transition-colors"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
