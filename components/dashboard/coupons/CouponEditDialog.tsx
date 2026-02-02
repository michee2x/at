"use client";

import { useState } from "react";
import { updateCoupon, DokanCoupon } from "@/lib/actions/dashboard/coupons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CouponEditDialogProps {
  coupon: DokanCoupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CouponEditDialog({ coupon, open, onOpenChange }: CouponEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: coupon.code,
    amount: coupon.amount,
    discount_type: coupon.discount_type,
    description: coupon.description,
    expiry_date: coupon.date_expires ? coupon.date_expires.split('T')[0] : "",
    usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : "",
    minimum_amount: coupon.minimum_amount,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateCoupon(coupon.id, {
        code: formData.code,
        amount: formData.amount,
        discount_type: formData.discount_type,
        description: formData.description,
        expiry_date: formData.expiry_date || undefined,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
        minimum_amount: formData.minimum_amount || undefined,
      });

      if (result.success) {
        toast.success("Coupon updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update coupon");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
          <DialogDescription>
            Update the details of your coupon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-code">Coupon Code *</Label>
            <Input
              id="edit-code"
              placeholder="e.g. SUMMER20"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-discount_type">Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) => handleChange("discount_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="fixed_cart">Fixed Amount</SelectItem>
                  <SelectItem value="fixed_product">Fixed Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Amount *</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="20"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              placeholder="Brief description of the offer"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-expiry_date">Expiry Date</Label>
              <Input
                id="edit-expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleChange("expiry_date", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-usage_limit">Usage Limit</Label>
              <Input
                id="edit-usage_limit"
                type="number"
                placeholder="Unlimited"
                value={formData.usage_limit}
                onChange={(e) => handleChange("usage_limit", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-minimum_amount">Minimum Order Amount</Label>
            <Input
              id="edit-minimum_amount"
              type="number"
              placeholder="Optional"
              value={formData.minimum_amount}
              onChange={(e) => handleChange("minimum_amount", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
