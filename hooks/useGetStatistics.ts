import { getReq } from "@/config/request";
import { useState } from "react";

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
    walletData: data?.data,
    // Add a way to manually refresh
    refresh: getStatistics,
  };
};
