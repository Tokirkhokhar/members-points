import { useState } from "react";
import { postReq } from "@/config/request";

export type ConvertCouponPayload = {
  points: number;
  walletId?: string;
};

export type ConvertCouponResponse = {
  message: string;
};

export const useConvertCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ConvertCouponResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertCoupon = async (
    issuedRewardId: string,
    payload: ConvertCouponPayload
  ): Promise<ConvertCouponResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        `/member-portal/${issuedRewardId}/convert`,
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
        return response;
      }
      throw new Error("Invalid response format");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to convert coupon";
      setError(errorMessage);
      console.error("Coupon conversion error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversion = () => {
    setData(null);
    setError(null);
  };

  return { convertCoupon, resetConversion, isLoading, data, error };
};
