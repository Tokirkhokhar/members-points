import { useState } from "react";
import { postReq } from "@/config/request";

export type BuyRewardResponse = {
  message: string;
};

export const useBuyReward = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BuyRewardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buyReward = async (rewardId: string): Promise<BuyRewardResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await postReq(
        `members/${rewardId}/buy`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ buyReward ~ response:", response);

      if (response?.message) {
        setData(response);
        return response;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to purchase reward";
      setError(errorMessage);
      console.error("Buy reward error:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setData(null);
    setError(null);
  };

  return { buyReward, isLoading, data, error, resetState };
};
