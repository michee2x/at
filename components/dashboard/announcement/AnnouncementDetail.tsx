"use client";

import { Announcement } from "@/lib/actions/dashboard/announcement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnnouncementBadge from "./AnnouncementBadge";
import { Mail, MailOpen, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  updateAnnouncementReadStatus,
  deleteAnnouncement,
  restoreAnnouncement,
} from "@/lib/actions/dashboard/announcement";

interface AnnouncementDetailProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function AnnouncementDetail({
  announcement,
  isOpen,
  onClose,
  onUpdate,
}: AnnouncementDetailProps) {
  const [loading, setLoading] = useState(false);

  if (!announcement) return null;

  const handleToggleReadStatus = async () => {
    setLoading(true);
    const newStatus = announcement.read_status === 'read' ? 'unread' : 'read';
    
    const result = await updateAnnouncementReadStatus(announcement.id, newStatus);
    
    if (result.success) {
      toast.success(`Marked as ${newStatus}`);
      onUpdate();
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Move this announcement to trash?")) return;
    
    setLoading(true);
    const result = await deleteAnnouncement(announcement.id);
    
    if (result.success) {
      toast.success("Announcement moved to trash");
      onClose();
      onUpdate();
    } else {
      toast.error(result.error || "Failed to delete announcement");
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    setLoading(true);
    const result = await restoreAnnouncement(announcement.id);
    
    if (result.success) {
      toast.success("Announcement restored");
      onClose();
      onUpdate();
    } else {
      toast.error(result.error || "Failed to restore announcement");
    }
    setLoading(false);
  };

  const isTrash = announcement.read_status === 'trash';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {announcement.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <span>{new Date(announcement.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
                <AnnouncementBadge status={announcement.read_status} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-2">
          {!isTrash && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleReadStatus}
                disabled={loading}
              >
                {announcement.read_status === 'read' ? (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4 mr-2" />
                    Mark as Read
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Move to Trash
              </Button>
            </>
          )}
          
          {isTrash && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestore}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
