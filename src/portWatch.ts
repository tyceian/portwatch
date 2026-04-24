// portWatch.ts — per-port watch rules: trigger alerts when specific ports open/close

export type WatchEvent = 'open' | 'close' | 'both';

export interface PortWatchRule {
  port: number;
  event: WatchEvent;
  label?: string;
  createdAt: number;
}

const watchRules = new Map<number, PortWatchRule>();

export function addWatchRule(
  port: number,
  event: WatchEvent = 'both',
  label?: string
): PortWatchRule {
  const rule: PortWatchRule = { port, event, label, createdAt: Date.now() };
  watchRules.set(port, rule);
  return rule;
}

export function removeWatchRule(port: number): boolean {
  return watchRules.delete(port);
}

export function getWatchRule(port: number): PortWatchRule | undefined {
  return watchRules.get(port);
}

export function listWatchRules(): PortWatchRule[] {
  return Array.from(watchRules.values()).sort((a, b) => a.port - b.port);
}

export function clearWatchRules(): void {
  watchRules.clear();
}

export function shouldNotifyWatch(
  port: number,
  eventType: 'open' | 'close'
): boolean {
  const rule = watchRules.get(port);
  if (!rule) return false;
  return rule.event === 'both' || rule.event === eventType;
}

export function getWatchCount(): number {
  return watchRules.size;
}
