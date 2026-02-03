"use client";

import { StoreFollower } from "@/lib/actions/dashboard/followers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FollowersTableProps {
  followers: StoreFollower[];
}

export function FollowersTable({ followers }: FollowersTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Followed Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {followers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                Your store does not have any followers yet.
              </TableCell>
            </TableRow>
          ) : (
            followers.map((follower) => (
              <TableRow key={follower.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={follower.avatar || ""} alt={follower.name || "User"} />
                      <AvatarFallback>{(follower.name || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{follower.name || "Unknown User"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {follower.date
                    ? format(new Date(follower.date), "MMM d, yyyy")
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
