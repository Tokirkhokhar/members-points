import { useState } from "react";
import { postReq } from "@/config/request";

export type BlockPointsPayload = {
  memberId: string;
  walletId?: string;
  points: number;
  transactionDocumentNumber: string | null;
};

export const useBlockPoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const blockPoints = async (payload: BlockPointsPayload) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        "/member-portal/block/points",
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
        err.response?.data?.message || "Failed to block points";
      setError(errorMessage);
      console.error("Block points error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { blockPoints, isLoading, data, error };
};
