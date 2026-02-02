"use client";

import { useState } from "react";
import { DokanCoupon, deleteCoupon } from "@/lib/actions/dashboard/coupons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CouponEditDialog } from "./CouponEditDialog";

interface CouponsTableProps {
  coupons: DokanCoupon[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<DokanCoupon | null>(null);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const result = await deleteCoupon(id);
    setIsDeleting(null);

    if (result.success) {
      toast.success("Coupon deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete coupon");
    }
  };

  const formatDiscount = (amount: string, type: string) => {
    if (type === "percent") {
      return `${amount}%`;
    }
    return `$${amount}`; // Assuming USD/default currency
  };

  const formatUsage = (count: number, limit: number | null) => {
    if (limit === null || limit === 0) { // Dokan usage_limit 0 means unlimited
      return `${count} / ∞`;
    }
    return `${count} / ${limit}`;
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Discount Type</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No coupons found. Create your first coupon!
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium text-primary">
                  {coupon.code.toUpperCase()}
                </TableCell>
                <TableCell>
                  {formatDiscount(coupon.amount, coupon.discount_type)}
                </TableCell>
                <TableCell className="capitalize">
                  {coupon.discount_type.replace("_", " ")}
                </TableCell>
                <TableCell>{formatUsage(coupon.usage_count, coupon.usage_limit)}</TableCell>
                <TableCell>
                  {coupon.date_expires
                    ? format(new Date(coupon.date_expires), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCoupon(coupon)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(coupon.id)}
                        disabled={isDeleting === coupon.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {editingCoupon && (
        <CouponEditDialog 
          coupon={editingCoupon} 
          open={!!editingCoupon} 
          onOpenChange={(open) => !open && setEditingCoupon(null)} 
        />
      )}
    </div>
  );
}
