"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import {
  useCreateTransaction,
  CreateTransactionPayload,
} from "@/hooks/useCreateTransaction";
import {
  useValidatePoints,
  ValidatePointsResponse,
} from "@/hooks/use-validate-points";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Gift,
  CheckCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { currencySymbol } from "@/constants/common";
import { generateTransactionDocumentNumber } from "@/lib/utils";

export function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createTransaction, isLoading: isCreatingTransaction } =
    useCreateTransaction();
  const {
    validatePoints,
    resetValidation,
    isLoading: isValidatingPoints,
    data: validationData,
  } = useValidatePoints();
  const { toast } = useToast();
  const router = useRouter();

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [isPointsValidated, setIsPointsValidated] = useState(false);

  const totalPrice = getTotalPrice();
  const finalAmount = validationData
    ? parseFloat(validationData.discountedAmount)
    : totalPrice;

  const handleValidatePoints = async () => {
    if (!pointsToRedeem || pointsToRedeem <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid points",
        description: "Please enter a valid number of points to redeem.",
      });
      return;
    }

    try {
      const response = await validatePoints({
        amount: totalPrice,
        pointsToUse: pointsToRedeem,
      });

      setIsPointsValidated(true);
      toast({
        title: "Points validated successfully!",
        description: `You'll save ${response.currencyData.code} ${response.discount} with ${response.pointsToUse} points.`,
      });
    } catch (error) {
      setIsPointsValidated(false);
      toast({
        variant: "destructive",
        title: "Points validation failed",
        description:
          "There was an error validating your points. Please try again.",
      });
    }
  };

  const handleResetPoints = () => {
    setPointsToRedeem(0);
    setIsPointsValidated(false);
    resetValidation();
  };

  const handlePayNow = async () => {
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to complete your purchase.",
      });
      router.push("/login");
      return;
    }

    try {
      const transactionPayload: CreateTransactionPayload = {
        documentNumber: generateTransactionDocumentNumber(),
        purchasePlace: "MembersPoint Store",
        purchasedAt: new Date().toISOString(),
        memberId: user.id,
        grossValue: finalAmount,
        currency: currencySymbol.KWD.trim(),
        items: items.map((item) => ({
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          grossValue: item.product.price * item.quantity,
          maker: item.product.brandName,
          category: item.product.category,
          labels: item.product.labels,
        })),
        labels: [
          { key: "channel", value: "web" },
          { key: "customer_type", value: "member" },
        ],
        ...(isPointsValidated &&
          pointsToRedeem > 0 && {
            redemptionDetails: {
              pointsToUse: pointsToRedeem,
            },
          }),
      };

      await createTransaction(transactionPayload);

      toast({
        title: "Payment successful!",
        description: "Your transaction has been processed successfully.",
      });

      clearCart();
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description:
          "There was an error processing your payment. Please try again.",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-[calc(100vh-13rem)]">
      <div className="mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium leading-tight mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.brandName} • SKU: {item.product.sku}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.product.category}</Badge>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {currencySymbol.KWD}
                          {item.product.price} × {item.quantity}
                        </p>
                        <p className="font-medium">
                          {currencySymbol.KWD}
                          {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {currencySymbol.KWD}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>

                {isPointsValidated && validationData && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>
                      Points Discount ({validationData.pointsToUse} points)
                    </span>
                    <span>
                      -{validationData.currencyData.code}{" "}
                      {validationData.discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currencySymbol.KWD}0.00</span>
                </div>

                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {validationData
                      ? validationData.currencyData.code
                      : currencySymbol.KWD}
                    {finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Please log in to complete your purchase
                  </p>
                  <Link href="/login">
                    <Button>Log In</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Member Information */}
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">Member Information</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Name:</strong> {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> {user?.email}
                    </p>
                  </div>

                  {/* Point Redemption Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Redeem Points</h3>
                      </div>
                      {validationData && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          <Info className="h-3 w-3" />
                          <span>
                            {validationData.conversionRate.points} pts ={" "}
                            {validationData.conversionRate.currency}{" "}
                            {validationData.currencyData.code}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Points Input Row */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Enter points"
                          value={pointsToRedeem || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setPointsToRedeem(value);
                            if (isPointsValidated) {
                              setIsPointsValidated(false);
                              resetValidation();
                            }
                          }}
                          min="0"
                          className="text-center"
                          disabled={isPointsValidated}
                        />
                      </div>

                      {!isPointsValidated ? (
                        <Button
                          onClick={handleValidatePoints}
                          disabled={isValidatingPoints || !pointsToRedeem}
                          variant="outline"
                          size="default"
                          className="px-4"
                        >
                          {isValidatingPoints ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Validate"
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResetPoints}
                          variant="ghost"
                          size="default"
                          className="px-4"
                        >
                          Reset
                        </Button>
                      )}
                    </div>

                    {/* Validation Success State */}
                    {isPointsValidated && validationData && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Points validated successfully!
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">
                              Points Used:
                            </span>
                            <span className="font-medium text-green-800 dark:text-green-200">
                              {validationData.pointsToUse}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">
                              Total amount:
                            </span>
                            <span className="font-medium text-green-800 dark:text-green-200">
                              {validationData.currencyData.code}{" "}
                              {validationData.amount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">
                              Discount:
                            </span>
                            <span className="font-medium text-green-800 dark:text-green-200">
                              {validationData.currencyData.code}{" "}
                              {validationData.discount}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                            <span className="text-green-700 dark:text-green-300 font-medium">
                              Checkout amount:
                            </span>
                            <span className="font-bold text-green-800 dark:text-green-200">
                              {validationData.currencyData.code}{" "}
                              {validationData.discountedAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Pay Now Button */}
                  <Button
                    onClick={handlePayNow}
                    disabled={isCreatingTransaction}
                    className="w-full"
                    size="lg"
                  >
                    {isCreatingTransaction ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now -{" "}
                        {validationData
                          ? validationData.currencyData.code
                          : currencySymbol.KWD}
                        {finalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to our terms of
                    service and privacy policy.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
