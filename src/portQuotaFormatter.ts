import type { QuotaRule } from './portQuota';

const TYPE_COLORS: Record<string, string> = {
  process: '\x1b[36m',
  tag: '\x1b[35m',
};
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';

export function formatQuotaType(type: 'process' | 'tag'): string {
  const color = TYPE_COLORS[type] ?? '';
  return `${color}${type}${RESET}`;
}

export function formatQuotaInline(rule: QuotaRule): string {
  return `${formatQuotaType(rule.type)} ${BOLD}${rule.target}${RESET} — max ${rule.max} port(s)`;
}

export function renderQuotaRow(rule: QuotaRule): string {
  const typeStr = formatQuotaType(rule.type).padEnd(18);
  const target = rule.target.padEnd(24);
  const max = String(rule.max).padStart(4);
  return `${typeStr}${target}${max}`;
}

export function renderQuotaTable(rules: QuotaRule[]): string {
  if (rules.length === 0) return 'No quota rules defined.';
  const header = `${'TYPE'.padEnd(18)}${'TARGET'.padEnd(24)}${'MAX'.padStart(4)}`;
  const divider = '-'.repeat(46);
  const rows = rules.map(renderQuotaRow);
  return [header, divider, ...rows].join('\n');
}

export function renderViolationWarning(
  type: 'process' | 'tag',
  target: string,
  current: number,
  max: number
): string {
  return `${RED}⚠ Quota exceeded${RESET}: ${formatQuotaType(type)} ${BOLD}${target}${RESET} has ${YELLOW}${current}${RESET} port(s) open (limit: ${max})`;
}

export function renderQuotaSummary(rules: QuotaRule[]): string {
  const processCount = rules.filter(r => r.type === 'process').length;
  const tagCount = rules.filter(r => r.type === 'tag').length;
  return `Quotas: ${processCount} process rule(s), ${tagCount} tag rule(s)`;
}
