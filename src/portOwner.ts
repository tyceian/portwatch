// portOwner.ts — track ownership/team assignments for ports

export interface OwnerRule {
  port: number;
  owner: string;
  team?: string;
  contact?: string;
  assignedAt: number;
}

const ownerMap = new Map<number, OwnerRule>();

export function setOwner(
  port: number,
  owner: string,
  team?: string,
  contact?: string
): OwnerRule {
  const rule: OwnerRule = {
    port,
    owner,
    team,
    contact,
    assignedAt: Date.now(),
  };
  ownerMap.set(port, rule);
  return rule;
}

export function removeOwner(port: number): boolean {
  return ownerMap.delete(port);
}

export function getOwner(port: number): OwnerRule | undefined {
  return ownerMap.get(port);
}

export function hasOwner(port: number): boolean {
  return ownerMap.has(port);
}

export function listOwners(): OwnerRule[] {
  return Array.from(ownerMap.values()).sort((a, b) => a.port - b.port);
}

export function getPortsByOwner(owner: string): OwnerRule[] {
  return listOwners().filter(
    (r) => r.owner.toLowerCase() === owner.toLowerCase()
  );
}

export function getPortsByTeam(team: string): OwnerRule[] {
  return listOwners().filter(
    (r) => r.team?.toLowerCase() === team.toLowerCase()
  );
}

export function clearOwners(): void {
  ownerMap.clear();
}

export function ownerCount(): number {
  return ownerMap.size;
}
