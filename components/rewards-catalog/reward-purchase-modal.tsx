"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Loader2,
  Gift,
  Tag,
  AlertCircle,
  Info,
} from "lucide-react";
import { AvailableReward } from "@/hooks/use-available-rewards";
import { useBuyReward } from "@/hooks/use-buy-reward";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RewardCouponType } from "@/hooks/use-members-rewards";
import { Input } from "../ui/input";

type RewardPurchaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: AvailableReward | null;
  onSuccess: () => void;
};

export function RewardPurchaseModal({
  open,
  onOpenChange,
  reward,
  onSuccess,
}: RewardPurchaseModalProps) {
  const { buyReward, isLoading } = useBuyReward();
  const { toast } = useToast();

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  if (!reward) {
    return null;
  }

  const formatRewardValue = (reward: AvailableReward) => {
    const value = parseFloat(reward.rewardValue);
    switch (reward.couponType) {
      case RewardCouponType.Percentage:
        return `${value}% OFF`;
      case RewardCouponType.Value:
        return `${value} ${reward.currencyData.code} OFF`;
      case RewardCouponType.UnitConversion:
        return `${reward.pointConversionRate?.points} Points = ${reward.pointConversionRate?.currency} ${reward.currencyData.code}`;
      default:
        return `${value} ${reward.currencyData.code}`;
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      if (
        reward.couponType === RewardCouponType.UnitConversion &&
        pointsToRedeem > 0
      ) {
        await buyReward(reward.id, pointsToRedeem);
      } else {
        await buyReward(reward.id);
      }
      toast({
        title: "Purchase successful!",
        description: `${reward.name} has been added to your rewards.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description:
          (error as Error)?.message ||
          "There was an error purchasing this reward. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setPointsToRedeem(0);
  };

  const handleClose = () => {
    onOpenChange(false);
    setPointsToRedeem(0);
  };

  const isUnitConversion =
    reward.couponType === RewardCouponType.UnitConversion;
  const isRedeemable = isUnitConversion
    ? !!pointsToRedeem
    : !!reward?.costInPoints;

  const isDisabled = isLoading || !isRedeemable;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Confirm Purchase
          </DialogTitle>
          <DialogDescription>
            Review the reward details before confirming your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Enhanced Reward Details Card */}
          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="flex gap-6 relative">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-inner">
                {reward.logoMedia?.mediaUrl ? (
                  <Image
                    src={reward.logoMedia.mediaUrl}
                    alt={reward.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl leading-tight mb-2 text-gray-900 dark:text-gray-100">
                  {reward.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  {reward.additionalDetails.brandName}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-3 py-1 shadow-md">
                    {formatRewardValue(reward)}
                  </Badge>
                  {reward.categories.length > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium border-2"
                    >
                      {reward.categories[0].name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Description Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Description
              </h4>
            </div>
            <div className="pl-5 space-y-3">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 bg-muted/30 p-4 rounded-lg">
                {reward.description}
              </p>
              {reward.additionalDetails.brandDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {reward.additionalDetails.brandDescription}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Usage Instructions */}
          {reward.additionalDetails.usageInstruction && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Usage Instructions
                </h4>
              </div>
              <div className="pl-5">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed text-green-800 dark:text-green-200">
                      {reward.additionalDetails.usageInstruction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Terms & Conditions */}
          {reward.additionalDetails.conditionDescription && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Terms & Conditions
                </h4>
              </div>
              <div className="pl-5">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-orange-800 dark:text-orange-200">
                    {reward.additionalDetails.conditionDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Enhanced Purchase Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Purchase Summary
              </h4>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
              {reward.price ? (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Reward Value
                  </span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    {reward.currencyData.code}{" "}
                    {parseFloat(reward.price).toFixed(2)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Usage Limit Per Member
                </span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  {reward.usageLimit.perMember
                    ? reward.usageLimit.perMember
                    : "Unlimited"}
                </span>
              </div>

              <Separator className="bg-purple-200 dark:bg-purple-700" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-sm">
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {reward.couponType === RewardCouponType.UnitConversion
                      ? "Points Required"
                      : "Cost In Points"}
                  </span>
                </div>
                {reward.couponType === RewardCouponType.UnitConversion ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Enter points"
                      value={pointsToRedeem || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setPointsToRedeem(value);
                      }}
                      min="0"
                      className="text-center w-32 font-semibold border-2 focus:border-amber-500 outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {parseFloat(reward.costInPoints)}
                    </span>
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      points
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Warning Alert */}
          <Alert className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-500 rounded-full">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
              <AlertDescription className="font-medium text-amber-800 dark:text-amber-200">
                <span className="font-bold text-amber-900 dark:text-amber-100">
                  {reward.couponType === RewardCouponType.UnitConversion
                    ? `${pointsToRedeem} points`
                    : `${parseFloat(reward.costInPoints)} points`}
                </span>{" "}
                will be deducted from your account if you confirm this purchase.
              </AlertDescription>
            </div>
          </Alert>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isDisabled}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground bg-muted/30 p-3 rounded-lg">
            By confirming this purchase, you agree to the terms and conditions
            of this reward.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
