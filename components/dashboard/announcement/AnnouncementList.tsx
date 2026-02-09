"use client";

import { Announcement } from "@/lib/actions/dashboard/announcement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AnnouncementBadge from "./AnnouncementBadge";
import { Eye, Mail, MailOpen, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import {
  updateAnnouncementReadStatus,
  deleteAnnouncement,
  restoreAnnouncement,
} from "@/lib/actions/dashboard/announcement";

interface AnnouncementListProps {
  announcements: Announcement[];
  loading: boolean;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onViewDetails: (announcement: Announcement) => void;
  onUpdate: () => void;
}

export default function AnnouncementList({
  announcements,
  loading,
  selectedIds,
  onSelectionChange,
  onViewDetails,
  onUpdate,
}: AnnouncementListProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(announcements.map(a => a.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleToggleReadStatus = async (announcement: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = announcement.read_status === 'read' ? 'unread' : 'read';
    
    const result = await updateAnnouncementReadStatus(announcement.id, newStatus);
    
    if (result.success) {
      toast.success(`Marked as ${newStatus}`);
      onUpdate();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Move this announcement to trash?")) return;
    
    const result = await deleteAnnouncement(id);
    
    if (result.success) {
      toast.success("Announcement moved to trash");
      onUpdate();
    } else {
      toast.error(result.error || "Failed to delete announcement");
    }
  };

  const handleRestore = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const result = await restoreAnnouncement(id);
    
    if (result.success) {
      toast.success("Announcement restored");
      onUpdate();
    } else {
      toast.error(result.error || "Failed to restore announcement");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading announcements...
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No announcements found.
      </div>
    );
  }

  const allSelected = announcements.length > 0 && selectedIds.length === announcements.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < announcements.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={someSelected ? "data-[state=checked]:bg-primary" : ""}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => {
            const isSelected = selectedIds.includes(announcement.id);
            const isTrash = announcement.read_status === 'trash';
            const isUnread = announcement.read_status === 'unread';

            return (
              <TableRow
                key={announcement.id}
                className={`cursor-pointer hover:bg-muted/50 ${isUnread ? 'font-medium' : ''}`}
                onClick={() => onViewDetails(announcement)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectOne(announcement.id, checked as boolean)}
                    aria-label={`Select ${announcement.title}`}
                  />
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {announcement.title}
                </TableCell>
                <TableCell>
                  {new Date(announcement.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <AnnouncementBadge status={announcement.read_status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(announcement);
                      }}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {!isTrash && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleToggleReadStatus(announcement, e)}
                          title={announcement.read_status === 'read' ? 'Mark as unread' : 'Mark as read'}
                        >
                          {announcement.read_status === 'read' ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(announcement.id, e)}
                          title="Move to trash"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    
                    {isTrash && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleRestore(announcement.id, e)}
                        title="Restore"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
