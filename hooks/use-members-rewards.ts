import { useState, useEffect } from "react";
import { getReq } from "@/config/request";

export enum IssuedRewardsStatus {
  Expired = "expired",
  Issued = "issued",
  Redeemed = "redeemed",
}

export enum RewardCouponType {
  Percentage = "percentage",
  UnitConversion = "unitConversion",
  Value = "value",
}

export type MemberReward = {
  id: string;
  reference: string;
  rewardId: string;
  memberId: string;
  issuedAt: string;
  couponCode: string;
  status: IssuedRewardsStatus;
  couponType: RewardCouponType;
  rewardValue: number;
  createdAt: string;
  reward: {
    name: string;
    nameAr: string;
  };
  redeemedAt?: string;
  expiredAt?: string;
  expirationDate: string;
  transactionReference?: string;
};

interface Response {
  data: MemberReward[];
  total: number;
  page: number;
  limit: number;
}

interface GetMemberRewardsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export const useMemberRewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Response | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getMemberRewardsApiCall = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");
      const { data: response } = await getReq("members/rewards", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page,
          limit,
          searchTerm,
        },
      });
      if (response) {
        setData(response);
      }
      return response;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMemberRewards = ({
    page = 1,
    limit = 10,
    searchTerm = "",
  }: GetMemberRewardsParams) => {
    setPage(page);
    setLimit(limit);
    setSearchTerm(searchTerm);
    getMemberRewardsApiCall();
  };

  return {
    getMemberRewards,
    isLoading,
    data,
  };
};
