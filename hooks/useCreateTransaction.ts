import { useState } from "react";
import { postReq } from "@/config/request";

export type TransactionItem = {
  name: string;
  sku: string;
  quantity: number;
  grossValue: number;
  maker: string;
  category: string;
  labels: Array<{
    key: string;
    value: string;
  }>;
};

export type CreateTransactionPayload = {
  documentNumber: string;
  purchasePlace: string;
  purchasedAt: string;
  memberId: string;
  grossValue: number;
  currency: string;
  items: TransactionItem[];
  labels: Array<{
    key: string;
    value: string;
  }>;
  discountDetails?: {
    pointsUsed?: number | string;
    actualAmount: number | string;
    discountedAmount: number | string;
    discountAmount: number | string;
    conversionRate?: {
      points: number;
      currency: number;
    };
    couponCode?: string;
    issuedRewardId?: string;
  };
};

export const useCreateTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (payload: CreateTransactionPayload) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq("members/transaction", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setData(response);
      }
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create transaction";
      setError(errorMessage);
      console.error("Transaction creation error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTransaction, isLoading, data, error };
};
