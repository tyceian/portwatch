/**
 * Throttle utility for controlling how frequently watcher callbacks fire.
 * Useful when ports open/close rapidly in quick succession.
 */

type ThrottledFn = (...args: unknown[]) => void;

interface ThrottleEntry {
  timer: ReturnType<typeof setTimeout>;
  lastCall: number;
}

const throttleMap = new Map<string, ThrottleEntry>();

/**
 * Returns a throttled version of the given function identified by a key.
 * The function will fire at most once per `intervalMs`.
 */
export function throttle(
  key: string,
  fn: ThrottledFn,
  intervalMs: number,
  args: unknown[] = []
): void {
  const existing = throttleMap.get(key);
  const now = Date.now();

  if (existing) {
    clearTimeout(existing.timer);
    const elapsed = now - existing.lastCall;
    const delay = Math.max(0, intervalMs - elapsed);
    const timer = setTimeout(() => {
      fn(...args);
      throttleMap.set(key, { timer, lastCall: Date.now() });
    }, delay);
    throttleMap.set(key, { timer, lastCall: existing.lastCall });
    return;
  }

  fn(...args);
  const timer = setTimeout(() => {
    throttleMap.delete(key);
  }, intervalMs);
  throttleMap.set(key, { timer, lastCall: now });
}

export function cancelThrottle(key: string): void {
  const entry = throttleMap.get(key);
  if (entry) {
    clearTimeout(entry.timer);
    throttleMap.delete(key);
  }
}

export function clearAllThrottles(): void {
  for (const [, entry] of throttleMap) {
    clearTimeout(entry.timer);
  }
  throttleMap.clear();
}

export function getThrottleCount(): number {
  return throttleMap.size;
}
