import { useState, useEffect } from "react";
import { getReq } from "@/config/request";

export type RewardCouponType = "percentage" | "unitConversion" | "value";
export type RewardType = "coupon" | "product" | "service";

export type AvailableReward = {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  nameAr: string;
  descriptionAr: string;
  code: string;
  type: RewardType;
  couponType: RewardCouponType;
  rewardValue: string;
  pointValue: string | null;
  costInPoints: string;
  price: string;
  logo: string;
  currency: string;
  usageLimit: {
    limit: number;
    perMember: number;
  };
  additionalDetails: {
    brandName: string;
    brandDescription: string;
    usageInstruction: string;
    conditionDescription: string;
  };
  catalogVisibility: {
    allTime: boolean;
    startDate: string;
    endDate: string;
  };
  currencyData: {
    id: string;
    code: string;
  };
  logoMedia: {
    id: string;
    mediaUrl: string;
  };
  categories: Array<{
    id: string;
    name: string;
    nameAr: string;
  }>;
};

export type AvailableRewardsResponse = {
  page: number;
  limit: number;
  total: number;
  data: AvailableReward[];
};

export const useAvailableRewards = (page: number = 1, limit: number = 10) => {
  const [rewards, setRewards] = useState<AvailableReward[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async (page: number = 1, limit: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      const { data: response } = await getReq(
        `members/rewards/available?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        setRewards(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(Math.ceil(response.total / limit));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch available rewards";
      setError(errorMessage);
      console.error("Fetch available rewards error:", errorMessage);

      // Set empty state when there's an error
      setRewards([]);
      setTotal(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPage = (page: number) => {
    fetchRewards(page, limit);
  };

  const refreshRewards = () => {
    fetchRewards(currentPage, limit);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchRewards(page, limit);
    }
  }, []);

  return {
    rewards,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    loadPage,
    refreshRewards,
  };
};
