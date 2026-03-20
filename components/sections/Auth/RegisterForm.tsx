"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Container, Input, Button, StatusAlert } from "@/components/ui";
import type { FormStatus } from "@/types";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await register({ email, password, name });
      setStatus("success");
      router.push("/");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <Container className="max-w-md w-full py-12">
        <div className="bg-bg-tertiary rounded-2xl p-8 border border-border">
          <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Create Account
          </h1>

          {status === "error" && (
            <StatusAlert variant="error">{error}</StatusAlert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-1">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="mt-4 text-center text-text-secondary text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
