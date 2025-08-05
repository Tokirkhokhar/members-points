import { getReq } from "@/config/request";
import { useState } from "react";

export interface PointStatisticsResponse {
  walletType: {
    walletTypeId: string;
    code: string;
    name: string;
    unitSingularName: string;
    unitPluralName: string;
    active: boolean;
    isDefault: boolean;
    createdAt: string;
  };
  createdAt: string;
  account: {
    accumulatedPoints: string;
    spentPoints: string;
    activePoints: string;
    expiredPoints: string;
    blockedPoints: string;
  };
  pointsLimitUsed: number;
}

export const useGetStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isFirstTimeAPIcall, setIsFirstTimeAPIcall] = useState(true);

  const getStatistics = async () => {
    try {
      setIsLoading(true);

      const { data: response } = await getReq("members/wallets");
      if (isFirstTimeAPIcall) {
        setIsFirstTimeAPIcall(false);
      }

      if (response) {
        setData(response);
      }
      return response;
    } catch (err) {
      console.error("Error fetching statistics:", err);
      // Don't stop polling on error, it will retry on next interval
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getStatistics,
    isLoading,
    walletData: data?.data as PointStatisticsResponse[],
    // Add a way to manually refresh
    refresh: getStatistics,
  };
};
