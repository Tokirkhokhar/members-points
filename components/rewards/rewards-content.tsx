"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  useMemberRewards,
  // MemberReward,
  IssuedRewardsStatus,
  RewardCouponType,
} from "@/hooks/use-members-rewards";
import { useRewardStatistics } from "@/hooks/use-reward-statistics";
import {
  Gift,
  Search,
  // Filter,
  Copy,
  // Calendar,
  Percent,
  DollarSign,
  Package,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CountUp } from "../ui/countUp";
import { StatsCard } from "../ui/StatsCard";

export function RewardsContent() {
  const {
    data,
    isLoading,
    getMemberRewards,
    refreshRewards: refreshRewardsApiCall,
  } = useMemberRewards();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<IssuedRewardsStatus | "all">(
  //   "all"
  // );
  // const [typeFilter, setTypeFilter] = useState<string>("all");
  const [debounceSearchText, setDebounceSearchText] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Update total when data changes
  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceSearchText(searchTerm?.trim());
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [searchTerm]);

  const rewards = data?.data;

  const getStatusIcon = (status: IssuedRewardsStatus) => {
    switch (status) {
      case IssuedRewardsStatus.Issued:
        return <Clock className="h-4 w-4" />;
      case IssuedRewardsStatus.Redeemed:
        return <CheckCircle className="h-4 w-4" />;
      case IssuedRewardsStatus.Expired:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: IssuedRewardsStatus) => {
    switch (status) {
      case IssuedRewardsStatus.Issued:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case IssuedRewardsStatus.Redeemed:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case IssuedRewardsStatus.Expired:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case RewardCouponType.Percentage:
        return <Percent className="h-4 w-4" />;
      case RewardCouponType.Value:
        return <DollarSign className="h-4 w-4" />;
      case RewardCouponType.UnitConversion:
        return <Package className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  //   use useCallback
  const { data: rewardStats, refetch: refetchStats } = useRewardStatistics();

  const refreshRewards = useCallback(() => {
    refreshRewardsApiCall();
    refetchStats();
  }, [refetchStats, getMemberRewards]);

  useEffect(() => {
    getMemberRewards({ page, limit: 10, search: debounceSearchText });
  }, [page, debounceSearchText]);

  const stats = {
    total: rewardStats?.totalRewards || 0,
    active: rewardStats?.activeRewards || 0,
    redeemed: rewardStats?.redeemedRewards || 0,
    expired: rewardStats?.expiredRewards || 0,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(total / 10)) {
      setPage(newPage);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Rewards</h1>
          <p className="text-muted-foreground">
            View and manage your issued rewards and coupons
          </p>
        </div>
        <Button onClick={refreshRewards} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<Gift className="h-5 w-5 text-primary" />}
          title="Total Rewards"
          value={stats.total}
          isCountUp
        />
        <StatsCard
          icon={<Clock className="h-5 w-5 text-green-600" />}
          title="Active Rewards"
          value={stats.active}
          isCountUp
        />
        <StatsCard
          icon={<CheckCircle className="h-5 w-5 text-blue-600" />}
          title="Redeemed Rewards"
          value={stats.redeemed}
          isCountUp
        />
        <StatsCard
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          title="Expired Rewards"
          value={stats.expired}
          isCountUp
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards or coupon codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={IssuedRewardsStatus.Issued}>
                  Active
                </SelectItem>
                <SelectItem value={IssuedRewardsStatus.Redeemed}>
                  Redeemed
                </SelectItem>
                <SelectItem value={IssuedRewardsStatus.Expired}>
                  Expired
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="freebie">Freebie</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      {/* Rewards List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : rewards?.length === 0 ? (
          <Card className="h-[470px]">
            <CardContent className="p-12 text-center">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No rewards found</h3>
              <p className="text-muted-foreground">
                You don&apos;t have any rewards yet. Keep earning points to
                unlock rewards!
              </p>
            </CardContent>
          </Card>
        ) : (
          rewards?.map((reward) => (
            <Card key={reward.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-lg",
                      reward.status === IssuedRewardsStatus.Issued
                        ? "bg-green-100 dark:bg-green-900/20"
                        : reward.status === IssuedRewardsStatus.Redeemed
                        ? "bg-blue-100 dark:bg-blue-900/20"
                        : reward.status === IssuedRewardsStatus.Expired
                        ? "bg-red-100 dark:bg-red-900/20"
                        : "bg-gray-100 dark:bg-gray-900/20"
                    )}
                  >
                    {getTypeIcon(reward.couponType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">
                          {reward.reward.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reward.reward.nameAr}
                        </p>
                      </div>
                      <Badge
                        className={cn("gap-1", getStatusColor(reward.status))}
                      >
                        {getStatusIcon(reward.status)}
                        {reward.status.charAt(0).toUpperCase() +
                          reward.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Coupon Code</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                            {reward.couponCode}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(reward.couponCode, "Coupon code")
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-medium">
                          {reward.couponType === "percentage"
                            ? `${reward.rewardValue}%`
                            : reward.couponType === "value"
                            ? `KWD ${reward.rewardValue}`
                            : "Free Item"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Issued Date</p>
                        <p className="font-medium">
                          {format(
                            new Date(reward.issuedAt),
                            "MMM dd, yyyy hh:mm a"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          {reward.status === IssuedRewardsStatus.Expired
                            ? "Expired On"
                            : "Expires On"}
                        </p>
                        <p
                          className={cn(
                            "font-medium",
                            reward.status === IssuedRewardsStatus.Expired
                              ? "text-red-600 dark:text-red-400"
                              : ""
                          )}
                        >
                          {reward.expiredAt
                            ? format(
                                new Date(reward.expiredAt),
                                "MMM dd, yyyy hh:mm a"
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm">
                        {reward.reference && (
                          <div>
                            <p className="text-muted-foreground">
                              Reward Reference
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                {reward.reference}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() =>
                                  copyToClipboard(
                                    reward.reference!,
                                    "Reward reference"
                                  )
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {reward.redeemedAt && (
                          <>
                            <div>
                              <p className="text-muted-foreground">
                                Redeemed Date
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(reward.redeemedAt),
                                  "MMM dd, yyyy hh:mm a"
                                )}
                              </p>
                            </div>
                            {reward.transactionReference && (
                              <div>
                                <p className="text-muted-foreground">
                                  Transaction
                                </p>
                                <div className="flex items-center gap-2">
                                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                    {reward.transactionReference}
                                  </code>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(
                                        reward.transactionReference!,
                                        "Transaction reference"
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {data?.data && data?.data.length > 0 && (
          <div className="flex items-center justify-between bottom-1 w-full pr-8 pl-6 my-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * 10 + 1, total)} to{" "}
              {Math.min(page * 10, total)} of {total} entries
            </p>
            <div className="flex items-center gap-4 cursor-pointer">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page * 10 >= total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
