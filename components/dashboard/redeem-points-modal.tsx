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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRedeemPoints } from "@/hooks/use-redeem-points";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const redeemFormSchema = z.object({
  points: z
    .number()
    .min(1, { message: "Points must be at least 1" })
    .max(10000, { message: "Cannot redeem more than 10,000 points at once" }),
  description: z
    .string()
    .max(200, { message: "Description must not exceed 200 characters" })
    .optional(),
});

type RedeemPointsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePoints: number;
  onSuccess?: () => void;
};

export function RedeemPointsModal({
  open,
  onOpenChange,
  availablePoints = 0,
  onSuccess,
}: RedeemPointsModalProps) {
  const { redeemPoints, isLoading } = useRedeemPoints();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof redeemFormSchema>>({
    resolver: zodResolver(redeemFormSchema),
    defaultValues: {
      points: undefined,
      description: "",
    },
  });

  const watchedPoints = form.watch("points");

  async function onSubmit(values: z.infer<typeof redeemFormSchema>) {
    if (values.points > availablePoints) {
      toast({
        variant: "destructive",
        title: "Insufficient points",
        description: `You only have ${availablePoints.toLocaleString()} points available.`,
      });
      return;
    }

    try {
      await redeemPoints({
        points: values.points,
        additionalInfo: values.description || undefined,
      });

      toast({
        title: "Points redeemed successfully!",
        description: `${values.points.toLocaleString()} points have been redeemed.`,
      });

      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Redemption failed",
        description:
          "There was an error redeeming your points. Please try again.",
      });
    }
  }

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Redeem Points
          </DialogTitle>
          <DialogDescription>
            Convert your points into rewards. You have{" "}
            <span className="font-semibold text-primary">
              {availablePoints.toLocaleString()} points
            </span>{" "}
            available.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points to Redeem</FormLabel>
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
                  <FormDescription>Minimum: 1 point</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedPoints > availablePoints && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You do not have enough points. Available:{" "}
                  {availablePoints.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a note about this redemption..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedPoints > 0 && watchedPoints <= availablePoints && (
              <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 dark:text-green-300">
                    Points to redeem:
                  </span>
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    {watchedPoints.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-green-700 dark:text-green-300">
                    Remaining balance:
                  </span>
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    {(availablePoints - watchedPoints).toLocaleString()}
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
                disabled={
                  isLoading ||
                  watchedPoints <= 0 ||
                  watchedPoints > availablePoints
                }
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redeeming...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem Points
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
