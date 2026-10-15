export interface RateLimitConfig {
  windowMs: number; // e.g. 60 * 1000 for 1 minute
  maxRequests: number; // max requests within windowMs
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket / sliding window rate limiter
const store = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

/**
 * Checks rate limit for a given identifier key (e.g. "ip:route")
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 60 }
): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(key, newRecord);
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt: newRecord.resetAt,
      retryAfterSec: 0,
    };
  }

  if (record.count >= config.maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSec,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
    retryAfterSec: 0,
  };
}

export function resetRateLimitKey(key: string): void {
  store.delete(key);
}

/**
 * Helper to extract client IP reliably from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Return the first IP in the list (client IP)
    const clientIp = forwarded.split(',')[0].trim();
    if (clientIp) return clientIp;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}
