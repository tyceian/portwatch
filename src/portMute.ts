// portMute.ts — temporarily mute alerts for a port (no expiry, manual toggle)

export interface MuteRule {
  port: number;
  reason?: string;
  mutedAt: number;
}

const muteStore = new Map<number, MuteRule>();

export function mutePort(port: number, reason?: string): MuteRule {
  const rule: MuteRule = { port, reason, mutedAt: Date.now() };
  muteStore.set(port, rule);
  return rule;
}

export function unmutePort(port: number): boolean {
  return muteStore.delete(port);
}

export function isMuted(port: number): boolean {
  return muteStore.has(port);
}

export function getMuteRule(port: number): MuteRule | undefined {
  return muteStore.get(port);
}

export function listMuted(): MuteRule[] {
  return Array.from(muteStore.values()).sort((a, b) => a.port - b.port);
}

export function clearMutes(): void {
  muteStore.clear();
}

export function muteCount(): number {
  return muteStore.size;
}

export function filterMuted(ports: number[]): number[] {
  return ports.filter((p) => !isMuted(p));
}
