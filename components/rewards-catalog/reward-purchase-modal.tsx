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

  const isUnitConversion =
    reward.couponType === RewardCouponType.UnitConversion;
  const isRedeemable = isUnitConversion
    ? !!pointsToRedeem
    : !!reward?.costInPoints;

  const isDisabled = isLoading || !isRedeemable;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <div className="space-y-6">
          {/* Reward Details */}
          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {reward.logoMedia?.mediaUrl ? (
                <Image
                  src={reward.logoMedia.mediaUrl}
                  alt={reward.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-1">
                {reward.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {reward.additionalDetails.brandName}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  {formatRewardValue(reward)}
                </Badge>
                {reward.categories.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {reward.categories[0].name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Description
            </h4>
            <p className="text-sm leading-relaxed">{reward.description}</p>
            {reward.additionalDetails.brandDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reward.additionalDetails.brandDescription}
              </p>
            )}
          </div>

          {/* Usage Instructions */}
          {reward.additionalDetails.usageInstruction && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Usage Instructions
              </h4>
              <p className="text-sm leading-relaxed">
                {reward.additionalDetails.usageInstruction}
              </p>
            </div>
          )}

          {/* Terms & Conditions */}
          {reward.additionalDetails.conditionDescription && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Terms & Conditions
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reward.additionalDetails.conditionDescription}
              </p>
            </div>
          )}

          <Separator />

          {/* Purchase Summary */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Purchase Summary
            </h4>
            <div className="space-y-2 p-4 rounded-lg bg-muted/30">
              {reward.price ? (
                <div className="flex justify-between text-sm">
                  <span>Reward Value</span>
                  <span>
                    {reward.currencyData.code}{" "}
                    {parseFloat(reward.price).toFixed(2)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between text-sm">
                <span>Usage Limit</span>
                <span>{reward.usageLimit.perMember} per member</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-base font-semibold">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-amber-500" />
                  <span>Points Required</span>
                </div>
                {reward.couponType === RewardCouponType.UnitConversion ? (
                  <Input
                    type="number"
                    placeholder="Enter points"
                    value={pointsToRedeem || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setPointsToRedeem(value);
                    }}
                    min="0"
                    className="text-center w-48"
                  />
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    {parseFloat(reward.costInPoints)} Points
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {reward.couponType === RewardCouponType.UnitConversion ? (
                <strong>{pointsToRedeem} points</strong>
              ) : (
                <strong>{parseFloat(reward.costInPoints)} points</strong>
              )}
              &nbsp; will be deducted from your account if you confirm this
              purchase.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isDisabled}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By confirming this purchase, you agree to the terms and conditions
            of this reward.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
