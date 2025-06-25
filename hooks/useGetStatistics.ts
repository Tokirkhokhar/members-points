import { getReq } from "@/config/request";
import { getCookie } from "@/lib/utils";
import { useState } from "react";

export const useGetStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const getStatistics = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("members/wallets", {
        headers: {
          // get auth token from local storage and pass as bearer token
          Authorization: `Bearer ${token}`,
        },
      });
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

  return { getStatistics, isLoading, walletData: data?.data };
};
