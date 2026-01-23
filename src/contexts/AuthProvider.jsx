import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/services/authAPI";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
