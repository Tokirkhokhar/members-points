"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import {
  useCreateTransaction,
  CreateTransactionPayload,
} from "@/hooks/useCreateTransaction";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { currencySymbol } from "@/constants/common";

export function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createTransaction, isLoading } = useCreateTransaction();
  const { toast } = useToast();
  const router = useRouter();

  const totalPrice = getTotalPrice();

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
        transactionReference: `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        purchasePlace: "MembersPoint Store",
        purchaseDate: new Date().toISOString(),
        memberId: user.id,
        grossValue: totalPrice,
        currency: currencySymbol.KWD.trim(),
        items: items.map((item) => ({
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          amount: item.product.price * item.quantity,
          brandName: item.product.brandName,
          category: item.product.category,
          customAttributes: item.product.customAttributes,
        })),
        customAttributes: [
          { key: "channel", value: "web" },
          { key: "customer_type", value: "member" },
        ],
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
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currencySymbol.KWD}0.00</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div> */}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {currencySymbol.KWD}
                    {totalPrice.toFixed(2)}
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
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-2">Member Information</h3>
                      <p className="text-sm text-muted-foreground">
                        <strong>Name:</strong> {user?.firstName}{" "}
                        {user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Phone:</strong> {user?.phoneNumber}
                      </p>
                      {/* <p className="text-sm text-muted-foreground">
                        <strong>Member ID:</strong> {user?.id}
                      </p> */}
                    </div>

                    {/* <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                      <h3 className="font-medium mb-2 text-green-800 dark:text-green-200">
                        Points Earning
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You will earn{" "}
                        <strong>{Math.floor(totalPrice * 10)} points</strong>{" "}
                        from this purchase!
                      </p>
                    </div> */}
                  </div>

                  <Button
                    onClick={handlePayNow}
                    disabled={isLoading}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now - {currencySymbol.KWD}
                        {totalPrice.toFixed(2)}
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
