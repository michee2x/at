"use client";

import { PermissionItem } from "@/lib/config/permissions-config";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PermissionCategoryProps {
  title: string;
  permissions: PermissionItem[];
  selectedPermissions: Record<string, boolean>;
  onPermissionToggle: (key: string, checked: boolean) => void;
}

export default function PermissionCategory({
  title,
  permissions,
  selectedPermissions,
  onPermissionToggle,
}: PermissionCategoryProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {permissions.map((permission) => (
          <div key={permission.key} className="flex items-center space-x-2">
            <Checkbox
              id={permission.key}
              checked={selectedPermissions[permission.key] || false}
              onCheckedChange={(checked) =>
                onPermissionToggle(permission.key, checked as boolean)
              }
            />
            <Label
              htmlFor={permission.key}
              className="text-sm font-normal cursor-pointer"
            >
              {permission.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
