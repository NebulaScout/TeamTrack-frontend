import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/authAPI";
import { mapUserFromAPI } from "@/utils/userMapper";

const AuthContext = createContext(null);

const normalizeRole = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        const mappedData = mapUserFromAPI(userData);
        setUser(mappedData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const login = async (credentials) => {
    const authResponse = await authAPI.login(credentials);
    const userData = await authAPI.getCurrentUser();
    const mappedData = mapUserFromAPI(userData);

    setUser(mappedData);
    setIsAuthenticated(true);

    // Return user so caller can route immediately by role
    return { authResponse, user: mappedData };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login", { replace: true });
    }
  };

  const isAdmin = normalizeRole(user?.role) === "ADMIN";
  const homeRoute = isAdmin ? "/admin/dashboard" : "/dashboard";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        isAdmin,
        homeRoute,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
