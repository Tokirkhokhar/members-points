import { ProtectedRoute } from "@/components/auth/protected-route";
import { RedemptionHistoryContent } from "@/components/redemption-history/redemption-history-content";

export default function RedemptionHistoryPage() {
  return (
    <ProtectedRoute>
      <RedemptionHistoryContent />
    </ProtectedRoute>
  );
}
