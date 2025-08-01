import { useState } from "react";
import { postReq } from "@/config/request";

export type UnBlockPointsPayload = {
  memberId: string;
  points: number;
  walletId?: string;
  transactionDocumentNumber: string;
};

export const useUnBlockPoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const unBlockPoints = async (blockedPointId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        `/member-portal/${blockedPointId}/unblock/points`,
        {},
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
        err.response?.data?.message || "Failed to unblock points";
      setError(errorMessage);
      console.error("Unblock points error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { unBlockPoints, isLoading, data, error };
};
