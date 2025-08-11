import { useState } from "react";
import { postReq } from "@/config/request";

export type ConvertCouponPayload = {
  issuedRewardId: string;
  points: number;
  walletCode?: string;
};

export type ConvertCouponResponse = {
  message: string;
};

export const useConvertCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ConvertCouponResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertCoupon = async ({
    issuedRewardId,
    points,
    walletCode,
  }: ConvertCouponPayload): Promise<ConvertCouponResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        `/member-portal/${issuedRewardId}/convert`,
        {
          points,
          ...(walletCode && { walletCode }),
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
