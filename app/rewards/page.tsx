import { ProtectedRoute } from "@/components/auth/protected-route";
import { RewardsContent } from "@/components/rewards/rewards-content";

export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <RewardsContent />
    </ProtectedRoute>
  );
}
