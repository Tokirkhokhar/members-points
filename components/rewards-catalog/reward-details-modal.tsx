"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Info,
  Gift,
  Tag,
  Calendar,
  Users,
  FileText,
  Building,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { AvailableReward } from "@/hooks/use-available-rewards";
import { format } from "date-fns";
import Image from "next/image";
import { RewardCouponType } from "@/hooks/use-members-rewards";

type RewardDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: AvailableReward | null;
};

export function RewardDetailsModal({
  open,
  onOpenChange,
  reward,
}: RewardDetailsModalProps) {
  if (!reward) return null;

  const formatRewardValue = (reward: AvailableReward) => {
    const value = parseFloat(reward.rewardValue);
    switch (reward.couponType) {
      case RewardCouponType.Percentage:
        return `${value}% OFF`;
      case RewardCouponType.Value:
        return `${value} ${reward.currencyData.code} OFF`;
      default:
        return `${value} ${reward.currencyData.code}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Info className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Reward Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this reward
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reward Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {reward.logoMedia?.mediaUrl ? (
              <Image
                src={reward.logoMedia.mediaUrl}
                alt={reward.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gift className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Reward Value Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">
                {formatRewardValue(reward)}
              </Badge>
            </div>

            {/* Category Badge */}
            {reward.categories.length > 0 && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">
                  {reward.categories?.map(({ name }) => name).join(", ")}
                </Badge>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{reward.name}</h3>
              {reward.nameAr && (
                <p className="text-lg text-muted-foreground">{reward.nameAr}</p>
              )}
            </div>

            {reward.couponType === RewardCouponType.UnitConversion ? (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center border-r-2 border-black">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Tag className="h-4 w-4 text-amber-500" />
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {reward.pointConversionRate?.points} Points&nbsp; = &nbsp;
                      {reward.pointConversionRate?.currency}&nbsp;
                      {reward.currencyData.code}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Points Conversion Rate
                  </p>
                </div>
                <div className="text-center flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">
                    Price-Based Purchase Not Allowed
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center border-r-2 border-black">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Tag className="h-4 w-4 text-amber-500" />
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {parseFloat(reward.costInPoints)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Points Required
                  </p>
                </div>
                <div className="text-center flex items-center justify-center">
                  {reward.price ? (
                    <>
                      <p className="text-2xl font-bold">
                        {reward.currencyData.code}&nbsp;
                        {parseFloat(reward.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Price in {reward.currencyData.code}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Price-Based Purchase Not Allowed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Reward Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reward Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Reward Value</p>
                <p className="font-medium">{formatRewardValue(reward)}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Created On</p>
                <p className="font-medium">
                  {format(new Date(reward.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              {reward?.minimumAmount && (
                <div>
                  <p className="text-muted-foreground mb-1">
                    Minimum Purchase Amount
                  </p>
                  <p className="font-medium">
                    {reward.minimumAmount} {reward.currencyData.code}
                  </p>
                </div>
              )}
              {reward?.couponType === RewardCouponType.Percentage &&
                reward?.amountCapLimit && (
                  <div>
                    <p className="text-muted-foreground mb-1">
                      Maximum Discount Limit
                    </p>
                    <p className="font-medium">
                      {reward.amountCapLimit} {reward.currencyData.code}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <Separator />

          {/* Brand Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Brand Details
            </h4>

            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground mb-1">Brand Name</p>
                <p className="font-medium">
                  {reward.additionalDetails.brandName}
                </p>
              </div>

              {reward.additionalDetails.brandDescription && (
                <div>
                  <p className="text-muted-foreground mb-1">
                    Brand Description
                  </p>
                  <p className="text-sm leading-relaxed">
                    {reward.additionalDetails.brandDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Description
            </h4>

            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground mb-1">
                  English Description
                </p>
                <p className="text-sm leading-relaxed">{reward.description}</p>
              </div>

              {reward.descriptionAr && (
                <div>
                  <p className="text-muted-foreground mb-1">
                    Arabic Description
                  </p>
                  <p className="text-sm leading-relaxed">
                    {reward.descriptionAr}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Usage Instructions */}
          {reward.additionalDetails.usageInstruction && (
            <>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Usage Instructions
                </h4>
                <p className="text-sm leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  {reward.additionalDetails.usageInstruction}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Terms & Conditions */}
          {reward.additionalDetails.conditionDescription && (
            <>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Terms & Conditions
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  {reward.additionalDetails.conditionDescription}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Usage Limits */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usage Limits
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-1">Total Limit</p>
                <p className="font-medium text-lg">
                  {reward.usageLimit.limit || "Unlimited"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-1">Per Member</p>
                <p className="font-medium text-lg">
                  {reward.usageLimit.perMember}
                </p>
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Catalog Visibility
            </h4>

            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    reward.catalogVisibility.allTime ? "default" : "secondary"
                  }
                >
                  {reward.catalogVisibility.allTime
                    ? "Always Visible"
                    : "Time Limited"}
                </Badge>
              </div>

              {!reward.catalogVisibility.allTime && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>
                    Start: {reward.catalogVisibility.startDate || "Not set"}
                  </p>
                  <p>End: {reward.catalogVisibility.endDate || "Not set"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {reward.categories.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {reward.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                      {category.nameAr && ` (${category.nameAr})`}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Close Button */}
          <div className="pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
