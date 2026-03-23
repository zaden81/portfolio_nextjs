import type {
  AuthApiResponse,
  AuthUser,
  LoginFormData,
  RegisterFormData,
  TokenPair,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function getApiUrl(): string {
  return API_URL;
}

export const authApi = {
  register(data: RegisterFormData): Promise<AuthApiResponse> {
    return authFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data: LoginFormData): Promise<AuthApiResponse> {
    return authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout(refreshToken: string): Promise<{ message: string }> {
    return authFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  refresh(
    refreshToken: string,
  ): Promise<{ tokens: TokenPair }> {
    return authFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  me(): Promise<{ user: AuthUser }> {
    return authFetch("/auth/me");
  },
};
