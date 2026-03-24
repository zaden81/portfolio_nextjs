"use client";

import Link from "next/link";

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Registration Error
        </h2>
        <p className="text-text-secondary mb-6">
          {error.message || "Something went wrong with registration. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-border hover:border-border-hover text-text-secondary hover:text-text-primary px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
