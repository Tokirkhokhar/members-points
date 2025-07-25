"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useConvertCoupon } from "@/hooks/use-convert-coupon";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calculateConvertedRewardValue } from "@/lib/utils";

const convertFormSchema = z.object({
  points: z
    .number()
    .min(1, { message: "Points must be at least 1" })
    .max(100000, {
      message: "Cannot convert more than 100,000 points at once",
    }),
});

type ConvertCouponModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issuedRewardId: string;
  conversionRate?: {
    points: number;
    currency: number;
  };
  currencyCode?: string;
  selectedReward?: any;
  onSuccess?: () => void;
};

export function ConvertCouponModal({
  open,
  onOpenChange,
  issuedRewardId,
  conversionRate,
  currencyCode = "KWD",
  selectedReward,
  onSuccess,
}: ConvertCouponModalProps) {
  const { convertCoupon, isLoading } = useConvertCoupon();
  const { toast } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<z.infer<typeof convertFormSchema>>({
    resolver: zodResolver(convertFormSchema),
    defaultValues: {
      points: 0,
    },
  });

  const watchedPoints = form.watch("points");

  // Calculate converted amount
  const convertedAmount =
    conversionRate && watchedPoints > 0
      ? (watchedPoints / conversionRate.points) * conversionRate.currency
      : 0;

  async function onSubmit(values: z.infer<typeof convertFormSchema>) {
    try {
      const response = await convertCoupon(issuedRewardId, {
        points: values.points,
      });

      // Show success modal
      setShowSuccessModal(true);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description:
          (error as Error)?.message ||
          "There was an error converting your points. Please try again.",
      });
    }
  }

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onOpenChange(false);
  };

  // Success Modal
  if (showSuccessModal) {
    return (
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
              <ArrowRightLeft className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-green-600">
              Conversion Successful!
            </DialogTitle>
            <DialogDescription>
              Your points have been successfully converted to currency.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSuccessClose}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
            <ArrowRightLeft className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Convert Points to Currency
          </DialogTitle>
          <DialogDescription>
            Convert your points to {currencyCode} currency.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points to Convert</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter points amount"
                      {...field}
                      onChange={(e) =>
                        e.target.value === "0"
                          ? field.onChange(undefined)
                          : field.onChange(Number(e.target.value))
                      }
                      value={field.value || ""}
                      className="text-center text-lg font-medium"
                    />
                  </FormControl>
                  <FormDescription>
                    {conversionRate && (
                      <>
                        Conversion rate: {conversionRate.points} points ={" "}
                        {conversionRate.currency} {currencyCode}
                      </>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedPoints > 0 && conversionRate && (
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300">
                    Points to convert:
                  </span>
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    {watchedPoints}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-blue-700 dark:text-blue-300">
                    You will receive:
                  </span>
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    {/* { convertedAmount.toFixed(2)} {currencyCode} */}
                    {calculateConvertedRewardValue({
                      conversionRate,
                      points: watchedPoints,
                      conversionRounding:
                        selectedReward?.pointConversionRounding,
                    })}{" "}
                    {currencyCode}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || watchedPoints <= 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Convert Points
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
