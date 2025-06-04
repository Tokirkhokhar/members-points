import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileContent } from "@/components/profile/profile-content";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
