import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; 
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthLoaded } = useAuthStore();
    const accessToken = localStorage.getItem("accessToken");

    if (!isAuthLoaded) {
        return null; // или прелоадер
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
