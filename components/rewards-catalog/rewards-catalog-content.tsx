"use client";

import { useState } from "react";
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
  useAvailableRewards,
  AvailableReward,
} from "@/hooks/use-available-rewards";
import {
  Gift,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Tag,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { RewardPurchaseModal } from "./reward-purchase-modal";
import { RewardSuccessModal } from "./reward-success-modal";
import { StatsCard } from "../ui/StatsCard";
import { RewardCouponType } from "@/hooks/use-members-rewards";
import { RewardDetailsModal } from "./reward-details-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function RewardsCatalogContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReward, setSelectedReward] = useState<AvailableReward | null>(
    null
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsReward, setDetailsReward] = useState<AvailableReward | null>(
    null
  );

  const { rewards, total, isLoading, error, loadPage, refreshRewards } =
    useAvailableRewards(currentPage, 12);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(total / itemsPerPage);

  const filteredRewards = rewards.filter(
    (reward) =>
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.additionalDetails.brandName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reward.categories.some((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadPage(page);
    }
  };

  const handleBuyClick = (reward: AvailableReward) => {
    setSelectedReward(reward);
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    setIsPurchaseModalOpen(false);
    setIsSuccessModalOpen(true);
    refreshRewards(); // Refresh the rewards list
  };

  const formatRewardValue = (reward: AvailableReward) => {
    const value = parseFloat(reward.rewardValue);
    switch (reward.couponType) {
      case RewardCouponType.Percentage:
        return `${value}% OFF`;
      case RewardCouponType.Value:
        return `${value} ${reward.currencyData.code} OFF`;
      case RewardCouponType.UnitConversion:
        return "";
      default:
        return `${value} ${reward.currencyData.code}`;
    }
  };

  const handleInfoClick = (reward: AvailableReward) => {
    setDetailsReward(reward);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Rewards Catalog
            </h1>
            <p className="text-muted-foreground">
              Discover and purchase amazing rewards with your points
            </p>
          </div>
          <Button onClick={refreshRewards} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Card */}
        <StatsCard
          icon={<Gift className="h-5 w-5 text-primary" />}
          title="Available Rewards"
          value={total}
          isCountUp
        />

        {/* Search */}
        <Card className="mb-6 mt-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rewards by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square relative">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredRewards.length === 0 ? (
          <div className="col-span-full">
            <Card className="h-[470px] flex flex-col justify-center items-center">
              <CardContent className="p-12 text-center">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No rewards found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms to see more results."
                    : "No rewards are currently available. Check back later!"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <Card
                key={reward.id}
                className="hover:shadow-lg transition-all duration-300 h-96"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Voucher Logo Placeholder */}
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    {reward.logoMedia?.mediaUrl ? (
                      <Image
                        src={reward.logoMedia.mediaUrl}
                        alt={reward.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}

                    {/* Reward Value Badge */}
                    {reward.couponType !== RewardCouponType.UnitConversion && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">
                          Reward: {formatRewardValue(reward)}
                        </Badge>
                      </div>
                    )}

                    {/* Categories */}
                    {reward.categories.length > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs">
                          {reward.categories
                            ?.map(({ name }) => name)
                            .join(", ")}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Reward Title and Status */}
                  <div className="space-y-3 my-2">
                    <div className="flex flex-row justify-between">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {reward.name}
                        </h3>
                        {/* Brand Name */}
                        <p className="text-sm text-muted-foreground mb-3">
                          Brand Name: {reward.additionalDetails.brandName}
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info
                            className="h-5 w-5 cursor-pointer"
                            onClick={() => handleInfoClick(reward)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Reward Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {/* Reward Details Grid */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {reward.couponType === RewardCouponType.UnitConversion
                            ? `${reward.pointConversionRate?.points} Points = ${reward.pointConversionRate?.currency} ${reward.currencyData.code}`
                            : `${reward.costInPoints} Points`}
                        </span>
                      </div>
                      {reward.price ? (
                        <div className="text-muted-foreground">
                          Price: {reward.currencyData.code}&nbsp;
                          {parseFloat(reward.price).toFixed(2)}
                        </div>
                      ) : null}
                    </div>
                    {/* Usage Limit */}
                    <div className="text-xs text-muted-foreground">
                      Limit: {reward.usageLimit.perMember} per member
                    </div>

                    {/* Buy Button */}
                    <Button
                      onClick={() => handleBuyClick(reward)}
                      className="w-full mt-4 gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy with Points
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, total)} to{" "}
                  {Math.min(currentPage * itemsPerPage, total)} of {total}{" "}
                  rewards
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
      </div>

      {/* Purchase Confirmation Modal */}
      <RewardPurchaseModal
        open={isPurchaseModalOpen}
        onOpenChange={setIsPurchaseModalOpen}
        reward={selectedReward}
        onSuccess={handlePurchaseSuccess}
      />

      {/* Success Modal */}
      <RewardSuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />

      {/* Reward Details Modal */}
      <RewardDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        reward={detailsReward}
      />
    </>
  );
}
