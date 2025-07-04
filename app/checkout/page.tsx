import { ProtectedRoute } from "@/components/auth/protected-route";
import { CheckoutContent } from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <CheckoutContent />
      </div>
    </ProtectedRoute>
  );
}
