import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't redirect if auth check fails - just set user to null
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await axios.post("/auth/login", { username, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log("Attempting signup with data:", {
        ...userData,
        password: "[REDACTED]",
      });

      // Log the base URL being used
      console.log("API Base URL:", axios.defaults.baseURL);

      const { data } = await axios.post("/auth/signup", userData);
      console.log("Signup successful, received data:", data);

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      console.error("Error response:", error.response?.data);

      return {
        success: false,
        error:
          error.response?.data?.message || "Signup failed: " + error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    }
  };

  const toggleFavoriteMovie = async (movieId) => {
    try {
      const { data } = await axios.post(`/auth/favorites/${movieId}`);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to toggle favorite",
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put("/auth/profile", profileData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    toggleFavoriteMovie,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
