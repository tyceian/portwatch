// Tracks lifecycle phases for ports: expected, starting, running, stopping, stopped

export type LifecyclePhase = 'expected' | 'starting' | 'running' | 'stopping' | 'stopped';

export interface LifecycleRule {
  port: number;
  phase: LifecyclePhase;
  since: number; // epoch ms
  note?: string;
}

const lifecycleMap = new Map<number, LifecycleRule>();

export function setLifecyclePhase(
  port: number,
  phase: LifecyclePhase,
  note?: string
): LifecycleRule {
  const rule: LifecycleRule = { port, phase, since: Date.now(), note };
  lifecycleMap.set(port, rule);
  return rule;
}

export function removeLifecycle(port: number): boolean {
  return lifecycleMap.delete(port);
}

export function getLifecycle(port: number): LifecycleRule | undefined {
  return lifecycleMap.get(port);
}

export function hasLifecycle(port: number): boolean {
  return lifecycleMap.has(port);
}

export function listLifecycles(): LifecycleRule[] {
  return Array.from(lifecycleMap.values()).sort((a, b) => a.port - b.port);
}

export function clearLifecycles(): void {
  lifecycleMap.clear();
}

export function getPortsByPhase(phase: LifecyclePhase): LifecycleRule[] {
  return listLifecycles().filter((r) => r.phase === phase);
}

export function transitionPhase(
  port: number,
  from: LifecyclePhase,
  to: LifecyclePhase
): LifecycleRule | null {
  const existing = lifecycleMap.get(port);
  if (!existing || existing.phase !== from) return null;
  return setLifecyclePhase(port, to, existing.note);
}
