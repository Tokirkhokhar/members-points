"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, ArrowRight } from "lucide-react";

type RewardSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RewardSuccessModal({
  open,
  onOpenChange,
}: RewardSuccessModalProps) {
  const router = useRouter();

  const handleGoToMyRewards = () => {
    onOpenChange(false);
    router.push("/rewards");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center font-semibold text-green-600 dark:text-green-400">
            Purchase Successful!
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            Your reward has been successfully purchased and added to your
            account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">
                Reward Added to Your Collection
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            You can now view and manage your reward in the My Rewards section.
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGoToMyRewards}
              className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Gift className="h-4 w-4" />
              Go to My Rewards
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button onClick={handleClose} variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
