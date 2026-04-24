// portPin.ts — pin ports to track them persistently across restarts

export interface PinRule {
  port: number;
  label?: string;
  pinnedAt: number;
  reason?: string;
}

const pinnedPorts = new Map<number, PinRule>();

export function pinPort(port: number, label?: string, reason?: string): PinRule {
  const rule: PinRule = {
    port,
    label,
    pinnedAt: Date.now(),
    reason,
  };
  pinnedPorts.set(port, rule);
  return rule;
}

export function unpinPort(port: number): boolean {
  return pinnedPorts.delete(port);
}

export function isPinned(port: number): boolean {
  return pinnedPorts.has(port);
}

export function getPinRule(port: number): PinRule | undefined {
  return pinnedPorts.get(port);
}

export function listPinned(): PinRule[] {
  return Array.from(pinnedPorts.values()).sort((a, b) => a.port - b.port);
}

export function clearPins(): void {
  pinnedPorts.clear();
}

export function getPinnedCount(): number {
  return pinnedPorts.size;
}

export function updatePinLabel(port: number, label: string): boolean {
  const rule = pinnedPorts.get(port);
  if (!rule) return false;
  rule.label = label;
  return true;
}

export function serializePins(): PinRule[] {
  return listPinned();
}

export function deserializePins(rules: PinRule[]): void {
  clearPins();
  for (const rule of rules) {
    pinnedPorts.set(rule.port, rule);
  }
}
