import { getReq } from "@/config/request";
import { getCookie } from "@/lib/utils";
import { useState } from "react";

export const useGetMe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const getMe = async (accessToken: string) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("auth_token");

      const { data: response } = await getReq("members/me", {
        headers: {
          // get auth token from local storage and pass as bearer token
          Authorization: `Bearer ${accessToken || token}`,
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

  return { getMe, isLoading, data };
};
