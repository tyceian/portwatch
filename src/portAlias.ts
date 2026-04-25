// portAlias.ts — assign human-friendly aliases to port numbers

export interface PortAlias {
  port: number;
  alias: string;
  description?: string;
  createdAt: string;
}

const aliasMap = new Map<number, PortAlias>();
const reverseMap = new Map<string, number>();

export function addAlias(port: number, alias: string, description?: string): PortAlias {
  const normalized = alias.trim().toLowerCase();
  if (reverseMap.has(normalized)) {
    const existing = reverseMap.get(normalized)!;
    if (existing !== port) {
      throw new Error(`Alias "${alias}" is already used by port ${existing}`);
    }
  }
  const rule: PortAlias = { port, alias: normalized, description, createdAt: new Date().toISOString() };
  aliasMap.set(port, rule);
  reverseMap.set(normalized, port);
  return rule;
}

export function removeAlias(port: number): boolean {
  const rule = aliasMap.get(port);
  if (!rule) return false;
  reverseMap.delete(rule.alias);
  aliasMap.delete(port);
  return true;
}

export function getAlias(port: number): PortAlias | undefined {
  return aliasMap.get(port);
}

export function resolveAlias(alias: string): number | undefined {
  return reverseMap.get(alias.trim().toLowerCase());
}

export function hasAlias(port: number): boolean {
  return aliasMap.has(port);
}

export function listAliases(): PortAlias[] {
  return Array.from(aliasMap.values()).sort((a, b) => a.port - b.port);
}

export function clearAliases(): void {
  aliasMap.clear();
  reverseMap.clear();
}

export function getAliasCount(): number {
  return aliasMap.size;
}
