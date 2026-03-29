import type {
  AuthApiResponse,
  AuthUser,
  LoginFormData,
  RegisterFormData,
  TokenPair,
} from "@/types";

// TODO: When migrating to HTTP-only cookies, add credentials: "include" to all fetch calls
const API_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

function getUrl(path: string): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it in your environment variables.",
    );
  }
  return `${API_URL}${path}`;
}

async function doFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return fetch(getUrl(path), { ...options, headers });
}

let refreshPromise: Promise<TokenPair> | null = null;

async function refreshTokens(): Promise<TokenPair> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch(getUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      localStorage.removeItem("refreshToken");
      accessToken = null;
      throw new Error("Token refresh failed");
    }

    const { tokens } = (await res.json()) as { tokens: TokenPair };
    accessToken = tokens.accessToken;
    localStorage.setItem("refreshToken", tokens.refreshToken);
    return tokens;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let res = await doFetch(path, options);

  if (res.status === 401 && accessToken) {
    try {
      await refreshTokens();
      res = await doFetch(path, options);
    } catch {
      // Refresh failed — fall through to error handling below
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it in your environment variables.",
    );
  }
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
