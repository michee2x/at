"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getVendorBadges,
  markBadgesAsSeen,
  type Badge,
} from "@/lib/actions/dashboard/badges";
import { categorizeBadges } from "@/lib/utils/badge-helpers";
import BadgeGrid from "@/components/dashboard/badges/BadgeGrid";
import BadgeDetail from "@/components/dashboard/badges/BadgeDetail";
import { toast } from "react-toastify";
import { Search, Award, Target } from "lucide-react";

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [filteredEarned, setFilteredEarned] = useState<Badge[]>([]);
  const [filteredAvailable, setFilteredAvailable] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const result = await getVendorBadges({ per_page: 100 });
      
      if (result.success) {
        const { earned, available } = categorizeBadges(result.data);
        setAllBadges(result.data);
        setEarnedBadges(earned);
        setAvailableBadges(available);
        setFilteredEarned(earned);
        setFilteredAvailable(available);
        
        // Mark badges as seen
        await markBadgesAsSeen();
      } else {
        toast.error(result.error || "Failed to load badges");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  // Filter badges based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    
    if (!query) {
      setFilteredEarned(earnedBadges);
      setFilteredAvailable(availableBadges);
      return;
    }

    setFilteredEarned(
      earnedBadges.filter(
        (badge) =>
          badge.badge_name.toLowerCase().includes(query) ||
          badge.event?.title?.toLowerCase().includes(query) ||
          badge.event_type.toLowerCase().includes(query)
      )
    );

    setFilteredAvailable(
      availableBadges.filter(
        (badge) =>
          badge.badge_name.toLowerCase().includes(query) ||
          badge.event?.title?.toLowerCase().includes(query) ||
          badge.event_type.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, earnedBadges, availableBadges]);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedBadge(null);
  };

  const totalBadges = allBadges.length;
  const earnedCount = earnedBadges.length;
  const availableCount = availableBadges.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Badges</h1>
        <p className="text-muted-foreground mt-2">
          Vendors with a good selling history on our marketplace are identified by seller badges.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Badges</p>
              <p className="text-2xl font-bold">{totalBadges}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Earned Badges</p>
              <p className="text-2xl font-bold">{earnedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Badges</p>
              <p className="text-2xl font-bold">{availableCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-lg border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by badge name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All ({totalBadges})
          </TabsTrigger>
          <TabsTrigger value="earned">
            My Badges ({earnedCount})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading badges...
            </div>
          ) : (
            <>
              {filteredEarned.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Earned Badges ({filteredEarned.length})
                  </h2>
                  <BadgeGrid
                    badges={filteredEarned}
                    isEarned={true}
                    onBadgeClick={handleBadgeClick}
                  />
                </div>
              )}

              {filteredAvailable.length > 0 && (
                <div className="space-y-3 mt-8">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Available Badges ({filteredAvailable.length})
                  </h2>
                  <BadgeGrid
                    badges={filteredAvailable}
                    isEarned={false}
                    onBadgeClick={handleBadgeClick}
                  />
                </div>
              )}

              {filteredEarned.length === 0 && filteredAvailable.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No badges found matching your search.
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="earned">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading badges...
            </div>
          ) : (
            <BadgeGrid
              badges={filteredEarned}
              isEarned={true}
              onBadgeClick={handleBadgeClick}
            />
          )}
        </TabsContent>

        <TabsContent value="available">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading badges...
            </div>
          ) : (
            <BadgeGrid
              badges={filteredAvailable}
              isEarned={false}
              onBadgeClick={handleBadgeClick}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <BadgeDetail
        badge={selectedBadge}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
