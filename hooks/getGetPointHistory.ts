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

export const useGetPointHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeAPIcall, setIsFirstTimeAPIcall] = useState(true);
  const [data, setData] = useState<Response | null>(null);

  const getGetPointHistory = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);

      const { data: response } = await getReq("members/wallets/point-history", {
        params: {
          page,
          limit,
        },
      });
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

  return {
    getGetPointHistory,
    isLoading,
    data,
  };
};
