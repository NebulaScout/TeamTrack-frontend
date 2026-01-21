import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>; //TODO: Add spinner

  if (!isAuthenticated) {
    if (location.pathname === "/login") return "";

    return <Navigate to="/login" replace />;
  }
  return children;
}
