import { ProtectedRoute } from "@/components/auth/protected-route";
import { RewardsCatalogContent } from "@/components/rewards-catalog/rewards-catalog-content";

export default function RewardsCatalogPage() {
  return (
    <ProtectedRoute>
      <RewardsCatalogContent />
    </ProtectedRoute>
  );
}
