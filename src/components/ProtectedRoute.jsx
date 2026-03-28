import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

const normalizeRole = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase();

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole) {
    const currentRole = normalizeRole(user?.role);
    const targetRole = normalizeRole(requiredRole);

    if (currentRole !== targetRole) {
      const fallback =
        currentRole === "ADMIN" ? "/admin/dashboard" : "/dashboard";
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}
