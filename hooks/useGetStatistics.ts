import { getReq } from "@/config/request";
import { getCookie } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface UseGetStatisticsProps {
  polling?: boolean;
  pollingInterval?: number;
}

export const useGetStatistics = ({
  polling = false,
  pollingInterval = 30000,
}: UseGetStatisticsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isFirstTimeAPIcall, setIsFirstTimeAPIcall] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout>();

  const getStatistics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("/member-portal/wallets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Start/stop polling when polling prop changes
  useEffect(() => {
    if (polling) {
      // Initial fetch
      if (!isFirstTimeAPIcall) {
        getStatistics().catch(console.error);
      }

      // Set up polling
      pollingRef.current = setInterval(() => {
        getStatistics().catch(console.error);
      }, pollingInterval);

      // Cleanup on unmount or when polling is disabled
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [polling, pollingInterval]);

  return {
    getStatistics,
    isLoading,
    walletData: data?.data,
    // Add a way to manually refresh
    refresh: getStatistics,
  };
};
