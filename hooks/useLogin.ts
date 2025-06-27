import { useState } from "react";
import { appConfig } from "@/config/app.config";
import { postReq } from "@/config/request";
import { getCookie } from "@/lib/utils";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ accessToken: string } | null>(null);

  const login = async (email: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      const payload = { email };

      const { data: response } = await postReq(
        "admin/members/generate-token",
        payload,
        {
          headers: {
            // get auth token from local storage and pass as bearer token
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  return { login, isLoading, data };
};
