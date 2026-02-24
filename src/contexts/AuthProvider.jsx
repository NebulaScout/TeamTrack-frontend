import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/authAPI";
import { mapUserFromAPI } from "@/utils/userMapper";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if user is logged in
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }

      try {
        // Validate token by fetching user data
        const userData = await authAPI.getCurrentUser();
        const mappedData = mapUserFromAPI(userData);
        setUser(mappedData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token is expired/ invalid and refresh failed
        console.error("Auth check failed: ", err);
        setIsAuthenticated(false);
        setUser(null);

        // Clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    // fetch user data after login
    const userData = await authAPI.getCurrentUser();
    const mappedData = mapUserFromAPI(userData);
    setUser(mappedData);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      <Navigate to="/login" />;
    } catch (err) {
      console.error("Logout API error:", err);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
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
