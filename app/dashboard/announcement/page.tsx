"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  getAnnouncements, 
  batchUpdateReadStatus, 
  batchDeleteAnnouncements,
  batchRestoreAnnouncements,
  Announcement,
  AnnouncementFilters as Filters,
} from "@/lib/actions/dashboard/announcement";
import AnnouncementList from "@/components/dashboard/announcement/AnnouncementList";
import AnnouncementFilters from "@/components/dashboard/announcement/AnnouncementFilters";
import AnnouncementDetail from "@/components/dashboard/announcement/AnnouncementDetail";
import { toast } from "react-toastify";
import { MailOpen, Trash2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 10,
    read_status: 'all',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const result = await getAnnouncements(filters);
      if (result.success) {
        setAnnouncements(result.data);
      } else {
        toast.error(result.error || "Failed to load announcements");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // Clear selections when filters change
    setSelectedIds([]);
  }, [filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleBatchMarkAsRead = async () => {
    if (selectedIds.length === 0) return;
    
    const result = await batchUpdateReadStatus(selectedIds, 'read');
    
    if (result.success) {
      toast.success(`Marked ${selectedIds.length} announcement(s) as read`);
      setSelectedIds([]);
      fetchAnnouncements();
    } else {
      toast.error(result.error || "Failed to update announcements");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Move ${selectedIds.length} announcement(s) to trash?`)) return;
    
    const result = await batchDeleteAnnouncements(selectedIds);
    
    if (result.success) {
      toast.success(`Moved ${selectedIds.length} announcement(s) to trash`);
      setSelectedIds([]);
      fetchAnnouncements();
    } else {
      toast.error(result.error || "Failed to delete announcements");
    }
  };

  const handleBatchRestore = async () => {
    if (selectedIds.length === 0) return;
    
    const result = await batchRestoreAnnouncements(selectedIds);
    
    if (result.success) {
      toast.success(`Restored ${selectedIds.length} announcement(s)`);
      setSelectedIds([]);
      fetchAnnouncements();
    } else {
      toast.error(result.error || "Failed to restore announcements");
    }
  };

  const handlePreviousPage = () => {
    if (filters.page && filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  const handleNextPage = () => {
    setFilters({ ...filters, page: (filters.page || 1) + 1 });
  };

  const isTrashView = filters.read_status === 'trash';
  const hasSelections = selectedIds.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-2">
          View and manage announcements from the admin.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4">
        <AnnouncementFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />
      </div>

      {/* Batch Actions Toolbar */}
      {hasSelections && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} announcement(s) selected
          </span>
          <div className="flex gap-2">
            {!isTrashView && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBatchMarkAsRead}
                >
                  <MailOpen className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBatchDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Move to Trash
                </Button>
              </>
            )}
            {isTrashView && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchRestore}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-card rounded-lg border shadow-sm">
        <AnnouncementList
          announcements={announcements}
          loading={loading}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onViewDetails={handleViewDetails}
          onUpdate={fetchAnnouncements}
        />
      </div>

      {/* Pagination */}
      {!loading && announcements.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!filters.page || filters.page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={announcements.length < (filters.per_page || 10)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      <AnnouncementDetail
        announcement={selectedAnnouncement}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUpdate={fetchAnnouncements}
      />
    </div>
  );
}
