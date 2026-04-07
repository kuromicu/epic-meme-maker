import { get } from "http";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthenticatedUser } from "../api/auth";

type User = {
  id: string;
  email: string;
  status: string;
  username: string;
  subscribersCount: number;
  subscriptionsCount: number;
  avatarResourceFilename: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const tokenKey = "access_token";

  const getToken = () => localStorage.getItem(tokenKey);

  const setToken = (token: string) => {
    localStorage.setItem(tokenKey, token);
  };

  const removeToken = () => {
    localStorage.removeItem(tokenKey);
  };

  // 🔁 Fetch current user
  const fetchUser = async () => {
    const token = getToken();
    if (!token) return null;

    try {
      const data = await getAuthenticatedUser(token);

      if (!data) {
        removeToken();
        return null;
      }

      console.log("Authenticated user data:", data);

      return data;
    } catch {
      removeToken();
      return null;
    }
  };

  // 🔄 Refresh user (manual trigger)
  const refreshUser = async () => {
    const u = await fetchUser();
    setUser(u);
  };

  // 🔑 Login
  const login = async (token: string) => {
    setToken(token);
    const u = await fetchUser();
    setUser(u);
  };

  // 🚪 Logout
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // 🚀 Init on app load
  useEffect(() => {
    const init = async () => {
      const u = await fetchUser();
      setUser(u);
      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};