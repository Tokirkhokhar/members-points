import { useState } from "react";
import { postReq } from "@/config/request";

export type SpendPointsPayload = {
  memberId: string;
  points: number;
  amount: number;
  walletId?: string;
  transactionDocumentNumber: string;
};

export const useSpendPoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const spendPoints = async (payload: SpendPointsPayload) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "members/spend/points",
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
        err.response?.data?.message || "Failed to spend points";
      setError(errorMessage);
      console.error("Spend points error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { spendPoints, isLoading, data, error };
};
