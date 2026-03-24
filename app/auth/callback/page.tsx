"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Container } from "@/components/ui";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(errorParam);
      setTimeout(() => router.push(`/login?error=${errorParam}`), 2000);
      return;
    }

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      router.push("/");
    } else {
      setError("Missing tokens");
      setTimeout(() => router.push("/login?error=oauth_failed"), 2000);
    }
  }, [searchParams, setTokens, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Container className="max-w-md text-center">
          <p className="text-red-500">Authentication failed: {error}</p>
          <p className="text-text-secondary mt-2">Redirecting to login...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <Container className="max-w-md text-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto" />
        <p className="text-text-secondary mt-4">Completing authentication...</p>
      </Container>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
