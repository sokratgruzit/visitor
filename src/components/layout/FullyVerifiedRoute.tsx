import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import type { ReactNode } from "react";

interface FullyVerifiedRouteProps {
  children: ReactNode;
}

export function FullyVerifiedRoute({ children }: FullyVerifiedRouteProps) {
  const { user, isAuthLoaded } = useAuthStore();
  const accessToken = localStorage.getItem("accessToken");

  if (!isAuthLoaded) return null;

  if (!accessToken || !user) return <Navigate to="/login" replace />;

  if (!user.emailVerified) return <Navigate to="/login" replace />;
  if (!user.isActive) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
