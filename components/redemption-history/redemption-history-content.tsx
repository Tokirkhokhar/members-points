"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useMemberRedemptions,
  MemberRedemption,
} from "@/hooks/use-member-redemptions";
import {
  History,
  Search,
  Copy,
  Percent,
  DollarSign,
  Package,
  RefreshCw,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RewardCouponType } from "@/hooks/use-members-rewards";
import { StatsCard } from "../ui/StatsCard";

export function RedemptionHistoryContent() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { redemptions, total, isLoading, error, refreshRedemptions, loadPage } =
    useMemberRedemptions(page, 20);
  const { toast } = useToast();

  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  const filteredRedemptions = redemptions.filter(
    (redemption) =>
      redemption?.rewardName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      redemption.reward?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      redemption.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: RewardCouponType) => {
    switch (type) {
      case RewardCouponType.Percentage:
        return <Percent className="h-4 w-4" />;
      case RewardCouponType.Value:
        return <DollarSign className="h-4 w-4" />;
      case RewardCouponType.UnitConversion:
        return <Package className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatRewardValue = (redemption: MemberRedemption) => {
    const value = parseFloat(redemption.rewardValue);
    switch (redemption.couponType) {
      case RewardCouponType.Percentage:
        return `${value}%`;
      case RewardCouponType.Value:
        return `${value} ${redemption.currencyData.code}`;
      case RewardCouponType.UnitConversion:
        return `${value} Units`;
      default:
        return `${value} ${redemption.currencyData.code}`;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
      loadPage(page);
    }
  };

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <History className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Failed to load redemption history
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshRedemptions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Redemption History
          </h1>
          <p className="text-muted-foreground">
            View your complete redemption history and transaction details
          </p>
        </div>
        <Button
          onClick={refreshRedemptions}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Card */}
      <div className="mb-6">
        <StatsCard
          icon={<History className="h-5 w-5 mt-1 text-primary" />}
          title="Total Redemptions"
          value={total}
          isCountUp
        />
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reward name or coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Redemptions List */}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredRedemptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No redemptions found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms to see more results."
                  : "You haven't made any redemptions yet. Start earning and redeeming points!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRedemptions.map((redemption) => (
            <Card
              key={redemption.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20">
                    {getTypeIcon(redemption.couponType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">
                          {redemption.rewardName || redemption?.reward?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {redemption?.reward?.nameAr}
                        </p>
                      </div>
                      <Badge className="gap-1 bg-green-100 hover:bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Redeemed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Reference</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                              {redemption.reference}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() =>
                                copyToClipboard(
                                  redemption.reference,
                                  "Reference"
                                )
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Coupon Code</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                              {redemption.couponCode}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() =>
                                copyToClipboard(
                                  redemption.couponCode,
                                  "Coupon code"
                                )
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Reward Value</p>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            {formatRewardValue(redemption)}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Issued On</p>
                          <p className="font-medium">
                            {format(
                              new Date(redemption.issuedAt),
                              "MMM dd, yyyy hh:mm a"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Redeemed On</p>
                          <p className="font-medium">
                            {format(
                              new Date(redemption.redeemedAt),
                              "MMM dd, yyyy hh:mm a"
                            )}
                          </p>
                        </div>

                        {redemption.transactionReference && (
                          <div>
                            <p className="text-muted-foreground">Transaction</p>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                {redemption.transactionReference}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() =>
                                  copyToClipboard(
                                    redemption.transactionReference!,
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * itemsPerPage + 1, total)} to{" "}
                {Math.min(page * itemsPerPage, total)} of {total} entries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {redemptions && redemptions.length > 0 && (
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
  );
}
