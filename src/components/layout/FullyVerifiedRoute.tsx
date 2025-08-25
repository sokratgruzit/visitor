import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
// import { useAppStore } from "../../store/useAppStore";
import type { ReactNode } from "react";

interface FullyVerifiedRouteProps {
  children: ReactNode;
}

export function FullyVerifiedRoute({ children }: FullyVerifiedRouteProps) {
  const { user, isAuthLoaded } = useAuthStore();
  // const { landingData } = useAppStore();
  // const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!isAuthLoaded) return null;
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  // if (!user.emailVerified) return <Navigate to="/login" replace />;
  if (user.subscriptionStatus === "inactive") return <Navigate to="/login" replace />;
  // if (landingData?.components?.length === 0 && location.pathname.includes("preview")) return <Navigate to="/dashboard/constructor" replace />;

  return <>{children}</>;
}
