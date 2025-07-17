import { useState } from "react";
import { postReq } from "@/config/request";

export type ValidatePointsPayload = {
  amount: number;
  points: number;
};

export type ValidatePointsResponse = {
  amount: string;
  pointsToUse: number;
  discount: string;
  discountedAmount: string;
  currencyData: {
    name: string;
    code: string;
  };
  conversionRate: {
    points: number;
    currency: number;
  };
};

export const useValidatePoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ValidatePointsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validatePoints = async (
    payload: ValidatePointsPayload
  ): Promise<ValidatePointsResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "members/validate/points",
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
        err.response?.data?.message || "Failed to validate points";
      setError(errorMessage);
      console.error("Points validation error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetValidation = () => {
    setData(null);
    setError(null);
  };

  return { validatePoints, resetValidation, isLoading, data, error };
};
