"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorStaff, getStaffPermissions, updateStaffPermissions } from "@/lib/actions/dashboard/staff";
import { PERMISSION_CATEGORIES } from "@/lib/config/permissions-config";
import PermissionCategory from "./PermissionCategory";
import { toast } from "react-toastify";

interface PermissionsModalProps {
  staff: VendorStaff;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PermissionsModal({
  staff,
  isOpen,
  onClose,
  onSuccess,
}: PermissionsModalProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen, staff.ID]);

  const loadPermissions = async () => {
    setLoading(true);
    const result = await getStaffPermissions(parseInt(staff.ID));
    if (result.success) {
      setPermissions(result.capabilities || {});
    } else {
      toast.error("Failed to load permissions");
    }
    setLoading(false);
  };

  const handlePermissionToggle = (key: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving permissions for staff:", staff.ID, permissions);
      const result = await updateStaffPermissions(parseInt(staff.ID), permissions);
      console.log("Save result:", result);
      if (result.success) {
        toast.success("Permissions updated successfully");
        onSuccess();
        onClose();
      } else {
        console.error("Update failed:", result.error);
        toast.error(result.error || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Exception during save:", error);
      toast.error("An error occurred while updating permissions");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Manage Permissions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {staff.display_name} ({staff.user_email})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {PERMISSION_CATEGORIES.map((category) => (
                <PermissionCategory
                  key={category.id}
                  title={category.title}
                  permissions={category.permissions}
                  selectedPermissions={permissions}
                  onPermissionToggle={handlePermissionToggle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Permissions
          </Button>
        </div>
      </div>
    </div>
  );
}
