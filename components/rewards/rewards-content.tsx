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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMemberRewards,
  MemberReward,
  RewardStatus,
} from "@/hooks/use-members-rewards";
import {
  Gift,
  Search,
  Filter,
  Copy,
  Calendar,
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

export function RewardsContent() {
  const { data, isLoading, getMemberRewards } = useMemberRewards();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RewardStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
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

  const getStatusIcon = (status: RewardStatus) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "redeemed":
        return <CheckCircle className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RewardStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "redeemed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4 w-4" />;
      case "fixed":
        return <DollarSign className="h-4 w-4" />;
      case "freebie":
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
  const refreshRewards = useCallback(() => {
    getMemberRewards({ page: 1, limit: 10, searchTerm: "" });
  }, []);

  useEffect(() => {
    getMemberRewards({ page, limit: 10, searchTerm: debounceSearchText });
  }, [page, debounceSearchText]);

  const getRewardStats = () => {
    const total = rewards?.length;
    const active = rewards?.filter((r) => r.status === "active").length;
    const redeemed = rewards?.filter((r) => r.status === "redeemed").length;
    const expired = rewards?.filter((r) => r.status === "expired").length;

    return { total, active, redeemed, expired };
  };

  const stats = getRewardStats();

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
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Gift className="h-5 w-5 text-primary" />
                <p className="text-base text-muted-foreground">Total Rewards</p>
              </div>
              <p className="text-xl font-bold ml-6">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Clock className="h-5 w-5 text-green-600" />
                <p className="text-base text-muted-foreground">Active</p>
              </div>
              <p className="text-xl font-bold ml-6">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p className="text-base text-muted-foreground">Redeemed</p>
              </div>
              <p className="text-xl font-bold ml-6">{stats.redeemed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-base text-muted-foreground">Expired</p>
              </div>
              <p className="text-xl font-bold ml-6">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div> */}

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

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
            </Select>
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
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any rewards yet. Keep earning points to unlock rewards!"}
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
                      reward.status === "active"
                        ? "bg-green-100 dark:bg-green-900/20"
                        : reward.status === "redeemed"
                        ? "bg-blue-100 dark:bg-blue-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
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
                            : reward.couponType === "fixed"
                            ? `KWD ${reward.rewardValue}`
                            : "Free Item"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Issued Date</p>
                        <p className="font-medium">
                          {format(new Date(reward.issuedAt), "MMM dd, yyyy")}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          {reward.status === "expired" ? "Expired" : "Expires"}
                        </p>
                        <p
                          className={cn(
                            "font-medium",
                            reward.status === "expired"
                              ? "text-red-600 dark:text-red-400"
                              : ""
                          )}
                        >
                          {format(
                            new Date(reward.expirationDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    {reward.redeemedAt && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Redeemed Date
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(reward.redeemedAt),
                                "MMM dd, yyyy HH:mm"
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
