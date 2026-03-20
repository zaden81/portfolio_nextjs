/**
 * Simple in-memory IP-based rate limiter.
 *
 * NOTE: On Vercel serverless, each instance has its own memory.
 * This provides per-instance rate limiting — a baseline defense,
 * not a hard global limit. For production-grade limiting, consider
 * Upstash Redis rate limiter or Vercel WAF.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.maxRequests - 1, resetAt: now + options.windowMs };
  }

  entry.count++;

  if (entry.count > options.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: options.maxRequests - entry.count, resetAt: entry.resetAt };
}
