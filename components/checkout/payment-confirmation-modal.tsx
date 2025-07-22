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
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  Gift,
  ShoppingCart,
} from "lucide-react";
import { CartItem } from "@/types/product";
import { currencySymbol } from "@/constants/common";
import Image from "next/image";

type PaymentConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  items: CartItem[];
  totalPrice: number;
  finalAmount: number;
  pointsUsed?: number;
  discount?: string;
  currencyCode?: string;
  couponCode?: string;
  couponDiscount?: number;
};

export function PaymentConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  items,
  totalPrice,
  finalAmount,
  pointsUsed,
  discount,
  currencyCode = "KWD",
  couponCode,
  couponDiscount,
}: PaymentConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Confirm Your Payment
          </DialogTitle>
          <DialogDescription>
            Please review your order details before proceeding with the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Order Items ({items.length})
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.product.brandName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        Qty: {item.quantity}
                      </Badge>
                      <span className="text-sm font-medium">
                        {currencySymbol.KWD}
                        {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Payment Summary
            </h3>
            <div className="space-y-2 p-4 rounded-lg bg-muted/30">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {currencySymbol.KWD}
                  {totalPrice.toFixed(2)}
                </span>
              </div>

              {pointsUsed && pointsUsed > 0 && discount && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <div className="flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    <span>Points Discount ({pointsUsed} points)</span>
                  </div>
                  <span>
                    -{currencyCode}
                    {discount}
                  </span>
                </div>
              )}

              {couponCode && couponDiscount && (
                <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    <span>Coupon Discount ({couponCode})</span>
                  </div>
                  <span>
                    -{currencyCode}
                    {couponDiscount}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{currencyCode}0.00</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span>
                  {currencyCode}
                  {finalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Points Information */}
          {(pointsUsed && pointsUsed > 0) || couponCode ? (
            <>
              <Separator />
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Applied Discounts
                  </span>
                </div>
                <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  {pointsUsed && pointsUsed > 0 && (
                    <p>
                      {pointsUsed} points will be deducted from your account
                      after successful payment.
                    </p>
                  )}
                  {couponCode && (
                    <p>
                      Coupon {couponCode} will be redeemed after successful
                      payment.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading || isProcessing}
            >
              Fail Payment
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading || isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By confirming this payment, you agree to our terms of service and
            privacy policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
