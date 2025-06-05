import { getReq } from "@/config/request";
import { useState } from "react";

export const useGetTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const getTransactions = async (page = 1, limit = 10, filter: any) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("members/wallets/transactions", {
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
    getTransactions,
    isLoading,
    data,
  };
};
