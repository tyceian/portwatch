// portWatchFormatter.ts — render watch rules in table and inline formats

import { PortWatchRule, WatchEvent } from './portWatch';

const EVENT_LABELS: Record<WatchEvent, string> = {
  open: '▲ open',
  close: '▼ close',
  both: '⇅ both',
};

export function formatWatchEvent(event: WatchEvent): string {
  return EVENT_LABELS[event] ?? event;
}

export function formatWatchRuleInline(rule: PortWatchRule): string {
  const label = rule.label ? ` (${rule.label})` : '';
  return `port ${rule.port}${label} → ${formatWatchEvent(rule.event)}`;
}

export function renderWatchRuleRow(rule: PortWatchRule): string {
  const port = String(rule.port).padEnd(8);
  const event = formatWatchEvent(rule.event).padEnd(12);
  const label = (rule.label ?? '—').padEnd(20);
  const created = new Date(rule.createdAt).toLocaleTimeString();
  return `  ${port}${event}${label}${created}`;
}

export function renderWatchTable(rules: PortWatchRule[]): string {
  if (rules.length === 0) {
    return '  No watch rules configured.';
  }
  const header =
    '  ' +
    'PORT    '.padEnd(8) +
    'EVENT       '.padEnd(12) +
    'LABEL               '.padEnd(20) +
    'CREATED';
  const divider = '  ' + '─'.repeat(56);
  const rows = rules.map(renderWatchRuleRow);
  return [header, divider, ...rows].join('\n');
}

export function renderWatchSummary(rules: PortWatchRule[]): string {
  if (rules.length === 0) return 'Watching: none';
  const ports = rules.map((r) => r.port).join(', ');
  return `Watching ${rules.length} port(s): ${ports}`;
}
