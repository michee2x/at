"use client";

import { VendorStaff } from "@/lib/actions/dashboard/staff";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Settings } from "lucide-react";

interface StaffListProps {
  staff: VendorStaff[];
  loading: boolean;
  onEdit: (staff: VendorStaff) => void;
  onDelete: (id: string | number) => void;
  onManagePermissions: (staff: VendorStaff) => void;
}

export default function StaffList({ staff, loading, onEdit, onDelete, onManagePermissions }: StaffListProps) {
  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading staff...</div>;
  }

  if (staff.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No staff members found. Add your first staff member to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Registered Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.ID}>
              <TableCell>{member.first_name}</TableCell>
              <TableCell>{member.last_name}</TableCell>
              <TableCell>{member.user_email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{new Date(member.user_registered).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onManagePermissions(member)}>
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(parseInt(member.ID))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
