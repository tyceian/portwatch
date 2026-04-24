// Track dependencies between ports (e.g. frontend relies on backend API)

export interface PortDependency {
  from: number;
  to: number;
  label?: string;
  createdAt: number;
}

const dependencies: PortDependency[] = [];

export function addDependency(from: number, to: number, label?: string): PortDependency {
  const existing = dependencies.find(d => d.from === from && d.to === to);
  if (existing) {
    if (label) existing.label = label;
    return existing;
  }
  const dep: PortDependency = { from, to, label, createdAt: Date.now() };
  dependencies.push(dep);
  return dep;
}

export function removeDependency(from: number, to: number): boolean {
  const idx = dependencies.findIndex(d => d.from === from && d.to === to);
  if (idx === -1) return false;
  dependencies.splice(idx, 1);
  return true;
}

export function getDependenciesFor(port: number): PortDependency[] {
  return dependencies.filter(d => d.from === port);
}

export function getDependentsOf(port: number): PortDependency[] {
  return dependencies.filter(d => d.to === port);
}

export function listDependencies(): PortDependency[] {
  return [...dependencies];
}

export function clearDependencies(): void {
  dependencies.length = 0;
}

export function hasDependency(from: number, to: number): boolean {
  return dependencies.some(d => d.from === from && d.to === to);
}

export function getAffectedPorts(closedPort: number): number[] {
  return getDependentsOf(closedPort).map(d => d.from);
}
