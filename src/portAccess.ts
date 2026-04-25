// Port access control: allow/deny rules for ports

export type AccessRule = {
  port: number;
  mode: 'allow' | 'deny';
  reason?: string;
  createdAt: number;
};

const accessRules = new Map<number, AccessRule>();

export function setAccessRule(
  port: number,
  mode: 'allow' | 'deny',
  reason?: string
): AccessRule {
  const rule: AccessRule = { port, mode, reason, createdAt: Date.now() };
  accessRules.set(port, rule);
  return rule;
}

export function removeAccessRule(port: number): boolean {
  return accessRules.delete(port);
}

export function getAccessRule(port: number): AccessRule | undefined {
  return accessRules.get(port);
}

export function isAllowed(port: number): boolean {
  const rule = accessRules.get(port);
  if (!rule) return true; // default allow
  return rule.mode === 'allow';
}

export function isDenied(port: number): boolean {
  return !isAllowed(port);
}

export function listAccessRules(): AccessRule[] {
  return Array.from(accessRules.values()).sort((a, b) => a.port - b.port);
}

export function clearAccessRules(): void {
  accessRules.clear();
}

export function getAccessSummary(): { allowed: number; denied: number } {
  let allowed = 0;
  let denied = 0;
  for (const rule of accessRules.values()) {
    if (rule.mode === 'allow') allowed++;
    else denied++;
  }
  return { allowed, denied };
}
