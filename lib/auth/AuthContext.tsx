"use client";

// TODO: Ideal security improvement — store refresh tokens in HTTP-only cookies
// set by the backend, not in localStorage. This requires backend changes to
// set cookies on login/refresh responses and read them on incoming requests.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser, LoginFormData, RegisterFormData } from "@/types";
import { authApi, setAccessToken } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount with cleanup for React Strict Mode
  useEffect(() => {
    let cancelled = false;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    // Remove token from localStorage immediately to reduce exposure window.
    // It will be written back only after a successful refresh.
    localStorage.removeItem("refreshToken");

    authApi
      .refresh(refreshToken)
      .then(({ tokens }) => {
        if (cancelled) return;
        setAccessToken(tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        return authApi.me();
      })
      .then((res) => {
        if (cancelled || !res) return;
        setUser(res.user);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const res = await authApi.login(data);
    setAccessToken(res.tokens.accessToken);
    localStorage.setItem("refreshToken", res.tokens.refreshToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    const res = await authApi.register(data);
    setAccessToken(res.tokens.accessToken);
    localStorage.setItem("refreshToken", res.tokens.refreshToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  const setTokens = useCallback(async (at: string, rt: string) => {
    setAccessToken(at);
    localStorage.setItem("refreshToken", rt);
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch {
      setAccessToken(null);
      localStorage.removeItem("refreshToken");
      setUser(null);
      throw new Error("Failed to verify authentication. Please try again.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
