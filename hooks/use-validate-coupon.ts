import { useState } from "react";
import { postReq } from "@/config/request";

export type ValidateCouponPayload = {
  couponCode: string;
  amount: number;
};

export type ValidateCouponResponse = {
  message: string;
  isValid: boolean;
  couponCode: string;
  issuedRewardId: string;
  price: number;
  discountedPrice: number;
  discount: number;
};

export const useValidateCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ValidateCouponResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateCoupon = async (
    payload: ValidateCouponPayload
  ): Promise<ValidateCouponResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "members/validate/coupon",
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
        err.response?.data?.message || "Failed to validate coupon";
      setError(errorMessage);
      console.error("Coupon validation error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetValidation = () => {
    setData(null);
    setError(null);
  };

  return { validateCoupon, resetValidation, isLoading, data, error };
};
