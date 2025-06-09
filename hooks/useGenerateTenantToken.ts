import { appConfig } from "@/config/app.config";
import { postReq } from "@/config/request";
import { useState } from "react";

export const useGenerateTenantToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ accessToken: string } | null>(null);

  const generateTenantToken = async () => {
    try {
      setIsLoading(true);
      const payload = {
        clientId: appConfig.clientId,
        clientSecret: appConfig.clientSecret,
      };

      const { data: response } = await postReq(
        "auth/generate-client-token",
        payload
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

  return { generateTenantToken, isLoading, data };
};
