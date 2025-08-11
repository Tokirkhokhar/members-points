import { useState } from "react";
import { postReq } from "@/config/request";

export type RedeemCouponPayload = {
  couponCode: string;
  amount: number;
  additionalInfo?: string;
};

export type RedeemCouponResponse = {
  message: string;
  couponCode: string;
  issuedRewardId: string;
  redeemedOn: string;
};

export const useRedeemCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RedeemCouponResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redeemCoupon = async (
    payload: RedeemCouponPayload
  ): Promise<RedeemCouponResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "/member-portal/redeem/coupon",
        payload
      );

      if (response) {
        setData(response);
        return response;
      }
      throw new Error("Invalid response format");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to redeem coupon";
      setError(errorMessage);
      console.error("Coupon redemption error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { redeemCoupon, isLoading, data, error };
};
