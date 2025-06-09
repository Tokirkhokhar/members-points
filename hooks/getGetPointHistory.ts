import { useState } from "react";
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
  const [data, setData] = useState<Response | null>(null);

  const getGetPointHistory = async (page = 1, limit = 10, filter: any) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("members/wallets/point-history", {
        headers: {
          // get auth token from local storage and pass as bearer token
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          ...filter,
        },
      });
      console.log("🚀 ~ getGetPointHistory ~ response:", response);
      if (response) {
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
