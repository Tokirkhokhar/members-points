import { useState } from "react";
import { appConfig } from "@/config/app.config";
import { postReq } from "@/config/request";
import { getCookie } from "@/lib/utils";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ accessToken: string } | null>(null);

  const login = async (email: string) => {
    try {
      setIsLoading(true);
      const payload = {
        memberEmail: email,
      };

      const { data: response } = await postReq(
        "members/generate-token",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getCookie("actk")}`,
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
