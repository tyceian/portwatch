// portSilence.ts — manage silenced/ignored ports for alerting

export interface SilenceRule {
  port: number;
  until: number; // epoch ms, 0 = permanent
  reason?: string;
}

const silencedPorts = new Map<number, SilenceRule>();

export function silencePort(port: number, durationMs: number, reason?: string): SilenceRule {
  const rule: SilenceRule = {
    port,
    until: durationMs === 0 ? 0 : Date.now() + durationMs,
    reason,
  };
  silencedPorts.set(port, rule);
  return rule;
}

export function unsilencePort(port: number): boolean {
  return silencedPorts.delete(port);
}

export function isSilenced(port: number): boolean {
  const rule = silencedPorts.get(port);
  if (!rule) return false;
  if (rule.until === 0) return true; // permanent
  if (Date.now() < rule.until) return true;
  silencedPorts.delete(port); // expired, clean up
  return false;
}

export function getSilenceRule(port: number): SilenceRule | undefined {
  return silencedPorts.get(port);
}

export function listSilenced(): SilenceRule[] {
  const now = Date.now();
  const active: SilenceRule[] = [];
  for (const [port, rule] of silencedPorts) {
    if (rule.until === 0 || now < rule.until) {
      active.push(rule);
    } else {
      silencedPorts.delete(port);
    }
  }
  return active;
}

export function clearAllSilences(): void {
  silencedPorts.clear();
}

export function getSilenceCount(): number {
  return silencedPorts.size;
}
