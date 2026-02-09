"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVendorStaff, deleteVendorStaff, VendorStaff } from "@/lib/actions/dashboard/staff";
import StaffList from "@/components/dashboard/staff/StaffList";
import StaffForm from "@/components/dashboard/staff/StaffForm";
import PermissionsModal from "@/components/dashboard/staff/PermissionsModal";
import { toast } from "react-toastify";

export default function StaffPage() {
  const [staff, setStaff] = useState<VendorStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<VendorStaff | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [managingStaff, setManagingStaff] = useState<VendorStaff | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await getVendorStaff();
      setStaff(data);
    } catch (error) {
      toast.error("Failed to load staff members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    const numericId = typeof id === 'string' ? parseInt(id) : id;
    const result = await deleteVendorStaff(numericId);
    if (result.success) {
      toast.success("Staff member deleted successfully.");
      fetchStaff();
    } else {
      toast.error(result.error || "Failed to delete staff member.");
    }
  };

  const handleEdit = (staffMember: VendorStaff) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchStaff();
  };

  const handleManagePermissions = (staffMember: VendorStaff) => {
    setManagingStaff(staffMember);
    setIsPermissionsModalOpen(true);
  };

  const handlePermissionsModalClose = () => {
    setIsPermissionsModalOpen(false);
    setManagingStaff(null);
  };

  const handlePermissionsSuccess = () => {
    fetchStaff();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-semibold">
                    {editingStaff ? "Edit Staff" : "Create Staff"}
                 </h2>
                 <Button variant="outline" onClick={handleFormClose}>
                     Back
                 </Button>
            </div>
          
          <StaffForm
            existingStaff={editingStaff}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <StaffList
            staff={staff}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManagePermissions={handleManagePermissions}
          />
        </div>
      )}

      {/* Permissions Modal */}
      {managingStaff && (
        <PermissionsModal
          staff={managingStaff}
          isOpen={isPermissionsModalOpen}
          onClose={handlePermissionsModalClose}
          onSuccess={handlePermissionsSuccess}
        />
      )}
    </div>
  );
}
