import { getReq } from "@/config/request";
import { useState } from "react";

export const useGetMembersWallets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const getMembersWallets = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("members/wallets/list", {
        headers: {
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

  return { getMembersWallets, isLoading, data };
};
