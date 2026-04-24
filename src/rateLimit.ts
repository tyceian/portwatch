// Rate limiter to prevent alert flooding for the same port

interface RateLimitEntry {
  count: number;
  firstSeen: number;
  lastSeen: number;
}

interface RateLimitConfig {
  windowMs: number;   // time window in ms
  maxAlerts: number;  // max alerts per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 5000,
  maxAlerts: 3,
};

const store = new Map<string, RateLimitEntry>();

export function getRateLimitKey(port: number, type: string): string {
  return `${port}:${type}`;
}

export function isRateLimited(
  port: number,
  type: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): boolean {
  const key = getRateLimitKey(port, type);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.firstSeen > config.windowMs) {
    store.set(key, { count: 1, firstSeen: now, lastSeen: now });
    return false;
  }

  entry.count += 1;
  entry.lastSeen = now;

  return entry.count > config.maxAlerts;
}

export function resetRateLimit(port: number, type: string): void {
  store.delete(getRateLimitKey(port, type));
}

export function clearRateLimits(): void {
  store.clear();
}

export function getRateLimitStats(port: number, type: string): RateLimitEntry | undefined {
  return store.get(getRateLimitKey(port, type));
}

/**
 * Removes all entries from the store whose time window has already expired.
 * Useful for long-running processes to prevent unbounded memory growth.
 */
export function pruneExpiredEntries(config: RateLimitConfig = DEFAULT_CONFIG): number {
  const now = Date.now();
  let pruned = 0;
  for (const [key, entry] of store.entries()) {
    if (now - entry.firstSeen > config.windowMs) {
      store.delete(key);
      pruned++;
    }
  }
  return pruned;
}
