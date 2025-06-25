"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PointsStatistics } from "@/components/dashboard/points-statistics";
import { PointsHistory } from "@/components/dashboard/points-history";
import {
  pointsService,
  PointsStatistics as PointsStatsType,
} from "@/services/points-service";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardContent() {
  const [statistics, setStatistics] = useState<PointsStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>

      {error && (
        <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[280px] w-full rounded-lg" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ) : (
        <Tabs defaultValue="statistics" className="space-y-6">
          {/* <TabsList>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="history">Points History</TabsTrigger>
          </TabsList> */}

          <TabsContent value="statistics" className="space-y-6">
            {statistics && <PointsStatistics statistics={statistics} />}
          </TabsContent>

          <TabsContent value="history">
            <PointsHistory />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
