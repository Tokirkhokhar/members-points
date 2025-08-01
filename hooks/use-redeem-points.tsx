import { useState } from "react";
import { postReq } from "../config/request";

export type RedeemPointsPayload = {
  points: number;
  additionalInfo?: string;
};

export const useRedeemPoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const redeemPoints = async (payload: RedeemPointsPayload) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "/member-portal/redeem-points",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setData(response);
      }
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to redeem points";
      setError(errorMessage);
      console.error("Points redemption error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { redeemPoints, isLoading, data, error };
};
