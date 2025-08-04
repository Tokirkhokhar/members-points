"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PointsStatistics } from "@/components/dashboard/points-statistics";
import {
  pointsService,
  PointsStatistics as PointsStatsType,
} from "@/services/points-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

export function DashboardContent() {
  const [statistics, setStatistics] = useState<PointsStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const stats = await pointsService.getPointsStatistics();
      setStatistics(stats);
      setError(null);
    } catch (err) {
      setError("Failed to load points statistics. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshRewards = useCallback(() => {
    fetchData();
  }, []);

  return (
    <div className="container p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Points</h1>
          <p className="text-muted-foreground">View and manage your points</p>
        </div>
        <Button onClick={refreshRewards} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-[450px] w-full rounded-lg" />
        </div>
      ) : (
        <PointsStatistics />
      )}
    </div>
  );
}
