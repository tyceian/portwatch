export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface PriorityRule {
  port: number;
  level: PriorityLevel;
  reason?: string;
  setAt: number;
}

const priorityMap = new Map<number, PriorityRule>();

const PRIORITY_ORDER: PriorityLevel[] = ['critical', 'high', 'medium', 'low'];

export function setPriority(port: number, level: PriorityLevel, reason?: string): PriorityRule {
  const rule: PriorityRule = { port, level, reason, setAt: Date.now() };
  priorityMap.set(port, rule);
  return rule;
}

export function removePriority(port: number): boolean {
  return priorityMap.delete(port);
}

export function getPriority(port: number): PriorityRule | undefined {
  return priorityMap.get(port);
}

export function hasPriority(port: number): boolean {
  return priorityMap.has(port);
}

export function getPriorityLevel(port: number): PriorityLevel | undefined {
  return priorityMap.get(port)?.level;
}

export function listPriorities(): PriorityRule[] {
  return Array.from(priorityMap.values()).sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.level) - PRIORITY_ORDER.indexOf(b.level)
  );
}

export function clearPriorities(): void {
  priorityMap.clear();
}

export function getPortsByLevel(level: PriorityLevel): number[] {
  return Array.from(priorityMap.values())
    .filter(r => r.level === level)
    .map(r => r.port);
}

export function comparePriority(a: number, b: number): number {
  const la = getPriorityLevel(a) ?? 'low';
  const lb = getPriorityLevel(b) ?? 'low';
  return PRIORITY_ORDER.indexOf(la) - PRIORITY_ORDER.indexOf(lb);
}
