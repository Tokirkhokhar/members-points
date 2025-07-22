import { useState, useEffect } from "react";
import { getReq } from "@/config/request";
import { RewardCouponType } from "./use-members-rewards";

export type MemberRedemption = {
  id: string;
  createdAt: string;
  reference: string;
  rewardId: string;
  memberId: string;
  issuedAt: string;
  couponCode: string;
  status: "redeemed";
  couponType: RewardCouponType;
  rewardValue: string;
  transactionReference: string | null;
  currency: string;
  redeemedAt: string;
  reward: {
    name: string;
    nameAr: string;
  };
  currencyData: {
    name: string;
    code: string;
  };
};

export type MemberRedemptionsResponse = {
  data: MemberRedemption[];
  total: number;
  page: number;
  limit: number;
};

export const useMemberRedemptions = (page: number = 1, limit: number = 20) => {
  const [redemptions, setRedemptions] = useState<MemberRedemption[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRedemptions = async (
    pageNum: number = page,
    pageLimit: number = limit
  ) => {
    try {
      const token = localStorage.getItem("auth_token");
      setIsLoading(true);
      setError(null);

      const { data: response } = await getReq(
        `members/redemptions?page=${pageNum}&limit=${pageLimit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        setRedemptions(response.data || []);
        setTotal(response.total || 0);
        setCurrentPage(response.page || pageNum);
      } else {
        console.warn("API response structure is unexpected:", response);
        setRedemptions([]);
        setTotal(0);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch redemption history";
      setError(errorMessage);
      console.error("Fetch redemptions error:", err);
      setRedemptions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions(page, limit);
  }, [page, limit]);

  const refreshRedemptions = () => {
    fetchRedemptions(currentPage, limit);
  };

  const loadPage = (pageNum: number) => {
    fetchRedemptions(pageNum, limit);
  };

  return {
    redemptions,
    total,
    currentPage,
    isLoading,
    error,
    refreshRedemptions,
    loadPage,
  };
};
