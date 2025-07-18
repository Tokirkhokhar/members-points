"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useBlockPoints } from "@/hooks/useBlockPoints";
import { useSpendPoints } from "@/hooks/useSpendPoints";
import { useUnBlockPoints } from "@/hooks/useUnBlockPoints";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Gift,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { currencySymbol } from "@/constants/common";
import { generateTransactionDocumentNumber } from "@/lib/utils";
import { PaymentConfirmationModal } from "./payment-confirmation-modal";
import { useGetMembersWallets } from "@/hooks/useGetMembersWallets";

export function CheckoutContent() {
  const { items, getTotalPrice, clearCart, cartId } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createTransaction, isLoading: isCreatingTransaction } =
    useCreateTransaction();
  const {
    validatePoints,
    resetValidation,
    isLoading: isValidatingPoints,
    data: validationData,
  } = useValidatePoints();
  const {
    getMembersWallets,
    isLoading: isMembersWalletsLoading,
    data: membersWallets,
  } = useGetMembersWallets();
  const { blockPoints, isLoading: isBlockingPoints } = useBlockPoints();
  const { spendPoints, isLoading: isSpendingPoints } = useSpendPoints();
  const { unBlockPoints, isLoading: isUnblockingPoints } = useUnBlockPoints();
  const { toast } = useToast();
  const router = useRouter();

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [isPointsValidated, setIsPointsValidated] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [defaultWallet, setDefaultWallet] = useState<any>(null);
  const [blockedPoints, setBlockedPoints] = useState<number>(0);
  const [blockPointId, setBlockPointId] = useState<string | null>(null);
  const [transactionDocumentNumber, setTransactionDocumentNumber] = useState<
    string | null
  >(null);

  const totalPrice = getTotalPrice();
  const finalAmount = validationData
    ? parseFloat(validationData.discountedAmount)
    : totalPrice;

  // Check if points are entered but not validated
  const hasInvalidatedPoints = pointsToRedeem > 0 && !isPointsValidated;

  useEffect(() => {
    getMembersWallets();
  }, []);

  useEffect(() => {
    if (membersWallets?.length) {
      const defaultWallet = membersWallets.map((wallet: any) =>
        wallet.isDefault == true ? wallet : null
      )?.[0];
      setDefaultWallet(defaultWallet);
    }
  }, [membersWallets]);

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
        points: pointsToRedeem,
      });

      setIsPointsValidated(true);
      toast({
        title: "Points validated successfully!",
        description: `You'll save ${response.currencyData.code} ${response.discount} with ${response?.points} points.`,
      });
    } catch (error) {
      const message = (error as Error).message;

      setIsPointsValidated(false);
      toast({
        variant: "destructive",
        title: "Points validation failed",
        description:
          (error as any)?.message ||
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
    const transactionDocumentNumber = generateTransactionDocumentNumber();
    setTransactionDocumentNumber(transactionDocumentNumber);

    // If points are validated, block them first
    if (isPointsValidated && pointsToRedeem > 0) {
      try {
        const blockPoint = await blockPoints({
          memberId: user.id,
          points: pointsToRedeem,
          walletId: defaultWallet?.id,
          transactionDocumentNumber,
        });
        setBlockedPoints(pointsToRedeem);
        setBlockPointId(blockPoint?.pointId);
        toast({
          title: "Points blocked",
          description: `${pointsToRedeem} points have been temporarily blocked for this transaction.`,
        });
      } catch (error) {
        const message = (error as Error).message;
        toast({
          variant: "destructive",
          title: "Failed to block points",
          description:
            message ||
            "There was an error blocking your points. Please try again.",
        });
        return;
      }
    }

    // Open confirmation modal
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      const documentNumber =
        transactionDocumentNumber || generateTransactionDocumentNumber();
      // First, spend the points if any were blocked
      if (blockedPoints > 0) {
        await spendPoints({
          points: blockedPoints,
          memberId: user!.id,
          amount: finalAmount,
          walletId: defaultWallet?.id,
          transactionDocumentNumber: documentNumber,
        });
      }

      // Create the transaction
      const transactionPayload: CreateTransactionPayload = {
        documentNumber,
        purchasePlace: "MembersPoint Store",
        purchasedAt: new Date().toISOString(),
        memberId: user!.id,
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
        ...(blockedPoints > 0 && {
          discountDetails: {
            pointsUsed: blockedPoints,
            actualAmount: totalPrice ?? 0,
            discountedAmount: finalAmount ?? 0,
            discountAmount: Number(validationData?.discount ?? 0),
            conversionRate: validationData?.conversionRate,
          },
        }),
      };

      await createTransaction(transactionPayload);

      toast({
        title: "Payment successful!",
        description: "Your transaction has been processed successfully.",
      });

      clearCart();
      setIsPaymentModalOpen(false);
      router.push("/dashboard");
    } catch (error) {
      // If transaction fails, unblock the points
      if (blockedPoints > 0 && blockPointId) {
        try {
          await unBlockPoints(blockPointId);
          toast({
            title: "Points unblocked",
            description:
              "Your points have been unblocked due to payment failure.",
          });
        } catch (unblockError) {
          toast({
            variant: "destructive",
            title: "Critical error",
            description: "Failed to unblock points. Please contact support.",
          });
        }
      }

      toast({
        variant: "destructive",
        title: "Payment failed",
        description:
          (error as Error)?.message ||
          "There was an error processing your payment. Please try again.",
      });
      setIsPaymentModalOpen(false);
    }
  };

  const handlePaymentCancel = async () => {
    // Unblock points if they were blocked
    if (blockedPoints > 0) {
      try {
        await unBlockPoints(blockPointId!);
        setBlockedPoints(0);
        toast({
          title: "Points unblocked",
          description: "Your points have been unblocked.",
        });
      } catch (error) {
        const message = (error as Error).message;
        toast({
          variant: "destructive",
          title: "Error unblocking points",
          description:
            message ||
            "There was an error unblocking your points. Please contact support.",
        });
      }
    }
  };

  const isProcessing =
    isBlockingPoints ||
    isSpendingPoints ||
    isCreatingTransaction ||
    isMembersWalletsLoading ||
    isUnblockingPoints;

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
    <TooltipProvider>
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
                        Points Discount ({validationData.points} points)
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
                        <strong>Name:</strong> {user?.firstName}{" "}
                        {user?.lastName}
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
                                {validationData.points}
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

                    {/* Pay Now Button with Tooltip */}
                    <div className="w-full">
                      {hasInvalidatedPoints ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full">
                              <Button
                                disabled={true}
                                className="w-full opacity-50 cursor-not-allowed"
                                size="lg"
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay Now - {currencySymbol.KWD}
                                {totalPrice.toFixed(2)}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800"
                          >
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                              <AlertCircle className="h-4 w-4" />
                              <span>Please validate your points first</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button
                          onClick={handlePayNow}
                          disabled={isProcessing}
                          className="w-full"
                          size="lg"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
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
                      )}
                    </div>

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

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
        isLoading={isProcessing}
        items={items}
        totalPrice={totalPrice}
        finalAmount={finalAmount}
        pointsUsed={validationData?.points}
        discount={validationData?.discount}
        currencyCode={validationData?.currencyData.code}
      />
    </TooltipProvider>
  );
}
