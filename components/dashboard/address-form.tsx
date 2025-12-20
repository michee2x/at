"use client";

import { useState } from "react";
import {
  updateCustomerData,
  type Address,
} from "@/lib/actions/dashboard/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddressFormProps {
  type: "billing" | "shipping";
  initialData?: Address;
}

export function AddressForm({ type, initialData }: AddressFormProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const addressData: Address = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      company: formData.get("company") as string,
      address_1: formData.get("address_1") as string,
      address_2: formData.get("address_2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postcode: formData.get("postcode") as string,
      country: formData.get("country") as string,
    };

    const result = await updateCustomerData({
      [type]: addressData,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Address updated successfully");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Something went wrong");
    }
  }

  if (!isEditing && initialData) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => setIsEditing(true)}
      >
        Edit Address
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={initialData?.first_name}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={initialData?.last_name}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address_1">Address</Label>
        <Input
          id="address_1"
          name="address_1"
          defaultValue={initialData?.address_1}
          required
        />
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          defaultValue={initialData?.city}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" defaultValue={initialData?.state} />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            defaultValue={initialData?.postcode}
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Address"}
        </Button>

        {initialData && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
