import { ProcessInfo, getProcessForPort } from './process';

interface CacheEntry {
  info: ProcessInfo;
  fetchedAt: number;
}

const TTL_MS = 5000;
const cache = new Map<number, CacheEntry>();

export function getCachedProcess(port: number): ProcessInfo | null {
  const entry = cache.get(port);
  if (entry && Date.now() - entry.fetchedAt < TTL_MS) {
    return entry.info;
  }
  const info = getProcessForPort(port);
  if (info) {
    cache.set(port, { info, fetchedAt: Date.now() });
    return info;
  }
  cache.delete(port);
  return null;
}

export function invalidateCache(port?: number): void {
  if (port !== undefined) {
    cache.delete(port);
  } else {
    cache.clear();
  }
}

export function getCacheSize(): number {
  return cache.size;
}
