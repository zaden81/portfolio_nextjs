"use client";

export default function GlobalError({
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
          Something went wrong
        </h2>
        <p className="text-text-secondary mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
