import { PriorityLevel, PriorityRule } from './portPriority';

const LEVEL_COLORS: Record<PriorityLevel, string> = {
  critical: '\x1b[31m',
  high:     '\x1b[33m',
  medium:   '\x1b[36m',
  low:      '\x1b[37m',
};
const RESET = '\x1b[0m';

const LEVEL_ICONS: Record<PriorityLevel, string> = {
  critical: '🔴',
  high:     '🟠',
  medium:   '🟡',
  low:      '⚪',
};

export function formatPriorityBadge(level: PriorityLevel): string {
  const color = LEVEL_COLORS[level];
  return `${color}[${level.toUpperCase()}]${RESET}`;
}

export function formatPriorityInline(rule: PriorityRule): string {
  const icon = LEVEL_ICONS[rule.level];
  const badge = formatPriorityBadge(rule.level);
  const reason = rule.reason ? ` — ${rule.reason}` : '';
  return `${icon} port ${rule.port} ${badge}${reason}`;
}

export function renderPriorityRow(rule: PriorityRule): string {
  const icon = LEVEL_ICONS[rule.level];
  const badge = formatPriorityBadge(rule.level);
  const reason = rule.reason ?? '—';
  const date = new Date(rule.setAt).toLocaleString();
  return `  ${icon} ${String(rule.port).padEnd(6)} ${badge.padEnd(20)} ${reason.padEnd(30)} ${date}`;
}

export function renderPriorityTable(rules: PriorityRule[]): string {
  if (rules.length === 0) return '  (no priority rules set)';
  const header = `  ${'PORT'.padEnd(6)} ${'LEVEL'.padEnd(20)} ${'REASON'.padEnd(30)} SET AT`;
  const divider = '  ' + '─'.repeat(74);
  const rows = rules.map(renderPriorityRow);
  return [header, divider, ...rows].join('\n');
}

export function renderPrioritySummary(rules: PriorityRule[]): string {
  const counts: Partial<Record<PriorityLevel, number>> = {};
  for (const r of rules) counts[r.level] = (counts[r.level] ?? 0) + 1;
  return Object.entries(counts)
    .map(([lvl, n]) => `${LEVEL_ICONS[lvl as PriorityLevel]} ${n} ${lvl}`)
    .join('  ');
}
