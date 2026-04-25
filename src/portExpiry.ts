export interface ExpiryRule {
  port: number;
  expiresAt: Date;
  reason?: string;
  createdAt: Date;
}

const expiryRules = new Map<number, ExpiryRule>();

export function setExpiry(
  port: number,
  expiresAt: Date,
  reason?: string
): ExpiryRule {
  const rule: ExpiryRule = {
    port,
    expiresAt,
    reason,
    createdAt: new Date(),
  };
  expiryRules.set(port, rule);
  return rule;
}

export function removeExpiry(port: number): boolean {
  return expiryRules.delete(port);
}

export function getExpiry(port: number): ExpiryRule | undefined {
  return expiryRules.get(port);
}

export function isExpired(port: number, now: Date = new Date()): boolean {
  const rule = expiryRules.get(port);
  if (!rule) return false;
  return now >= rule.expiresAt;
}

export function listExpired(now: Date = new Date()): ExpiryRule[] {
  return Array.from(expiryRules.values()).filter((r) => now >= r.expiresAt);
}

export function listExpiring(
  withinMs: number,
  now: Date = new Date()
): ExpiryRule[] {
  const cutoff = new Date(now.getTime() + withinMs);
  return Array.from(expiryRules.values()).filter(
    (r) => r.expiresAt > now && r.expiresAt <= cutoff
  );
}

export function listExpiryRules(): ExpiryRule[] {
  return Array.from(expiryRules.values());
}

export function clearExpiryRules(): void {
  expiryRules.clear();
}
