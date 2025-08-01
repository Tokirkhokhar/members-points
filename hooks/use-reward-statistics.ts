import { getReq } from "@/config/request";
import { useState, useEffect } from "react";

export interface RewardStatistics {
  totalRewards: number;
  activeRewards: number;
  redeemedRewards: number;
  expiredRewards: number;
}

interface UseRewardStatisticsProps {
  enabled?: boolean;
}

export const useRewardStatistics = ({
  enabled = true,
}: UseRewardStatisticsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RewardStatistics | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchRewardStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      const { data: response } = await getReq(
        "/member-portal/rewards/statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        setData(response);
      }

      return response;
    } catch (err) {
      console.error("Error fetching reward statistics:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch reward statistics")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchRewardStatistics();
    }
  }, [enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRewardStatistics,
  };
};
