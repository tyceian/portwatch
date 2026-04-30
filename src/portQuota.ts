// Port quota: limit how many ports a process/tag can hold simultaneously

export interface QuotaRule {
  target: string; // process name or tag
  type: 'process' | 'tag';
  max: number;
  createdAt: number;
}

const quotaRules = new Map<string, QuotaRule>();

function quotaKey(type: 'process' | 'tag', target: string): string {
  return `${type}:${target}`;
}

export function setQuota(type: 'process' | 'tag', target: string, max: number): QuotaRule {
  if (max < 1) throw new Error('Quota max must be at least 1');
  const rule: QuotaRule = { target, type, max, createdAt: Date.now() };
  quotaRules.set(quotaKey(type, target), rule);
  return rule;
}

export function removeQuota(type: 'process' | 'tag', target: string): boolean {
  return quotaRules.delete(quotaKey(type, target));
}

export function getQuota(type: 'process' | 'tag', target: string): QuotaRule | undefined {
  return quotaRules.get(quotaKey(type, target));
}

export function hasQuota(type: 'process' | 'tag', target: string): boolean {
  return quotaRules.has(quotaKey(type, target));
}

export function listQuotas(): QuotaRule[] {
  return Array.from(quotaRules.values()).sort((a, b) => a.createdAt - b.createdAt);
}

export function clearQuotas(): void {
  quotaRules.clear();
}

export function checkQuotaViolation(
  type: 'process' | 'tag',
  target: string,
  currentCount: number
): { violated: boolean; max: number; current: number } | null {
  const rule = getQuota(type, target);
  if (!rule) return null;
  return {
    violated: currentCount > rule.max,
    max: rule.max,
    current: currentCount,
  };
}
