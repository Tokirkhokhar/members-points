import { useEffect, useRef, useState } from "react";
import { getReq } from "@/config/request";
import { WalletType } from "@/enums";
import { PointTransaction } from "@/services/points-service";

interface Response {
  data: PointTransaction[];
  total: number;
  page: number;
  limit: number;
  wallets: {
    id: string;
    name: string;
    uniqueId: string;
    type: WalletType;
    isActive: boolean;
  };
}

interface UseGetPointHistoryProps {
  polling?: boolean;
  pollingInterval?: number;
}

export const useGetPointHistory = ({
  polling = false,
  pollingInterval = 30000,
}: UseGetPointHistoryProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeAPIcall, setIsFirstTimeAPIcall] = useState(true);
  const [data, setData] = useState<Response | null>(null);
  const pollingRef = useRef<NodeJS.Timeout>();

  const getGetPointHistory = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq(
        "/member-portal/wallets/point-history",
        {
          headers: {
            // get auth token from local storage and pass as bearer token
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        }
      );
      if (response) {
        if (isFirstTimeAPIcall) {
          setIsFirstTimeAPIcall(false);
        }
        setIsLoading(false);
        setData(response);
      }
      return response;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start/stop polling when polling prop changes
  useEffect(() => {
    if (polling) {
      // Initial fetch
      if (!isFirstTimeAPIcall) {
        getGetPointHistory().catch(console.error);
      }

      // Set up polling
      pollingRef.current = setInterval(() => {
        getGetPointHistory().catch(console.error);
      }, pollingInterval);

      // Cleanup on unmount or when polling is disabled
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [polling, pollingInterval, isFirstTimeAPIcall]);

  return {
    getGetPointHistory,
    isLoading,
    data,
  };
};
