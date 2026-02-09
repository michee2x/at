"use client";

import { useState } from "react";
import { VendorStaff, createVendorStaff, updateVendorStaff } from "@/lib/actions/dashboard/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface StaffFormProps {
  existingStaff?: VendorStaff | null;
  onSuccess: () => void;
}

export default function StaffForm({ existingStaff, onSuccess }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: existingStaff?.first_name || "",
    last_name: existingStaff?.last_name || "",
    email: existingStaff?.user_email || "",
    phone: existingStaff?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (existingStaff) {
        result = await updateVendorStaff(parseInt(existingStaff.ID), formData);
      } else {
        result = await createVendorStaff(formData);
      }

      if (result.success) {
        toast.success(`Staff member ${existingStaff ? 'updated' : 'created'} successfully.`);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to save staff member.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {existingStaff ? "Update Staff" : "Create Staff"}
        </Button>
      </div>
    </form>
  );
}
