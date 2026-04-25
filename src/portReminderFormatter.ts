import { ReminderRule } from './portReminder';

function fmtInterval(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 3_600_000)}h`;
}

export function formatReminderInline(rule: ReminderRule): string {
  return `port ${rule.port} every ${fmtInterval(rule.intervalMs)}: "${rule.message}"`;
}

export function renderReminderRow(rule: ReminderRule): string {
  const interval = fmtInterval(rule.intervalMs);
  const last = rule.lastTriggered
    ? new Date(rule.lastTriggered).toLocaleTimeString()
    : 'never';
  return `  ${String(rule.port).padEnd(6)} ${interval.padEnd(6)} ${last.padEnd(12)} ${rule.message}`;
}

export function renderReminderTable(rules: ReminderRule[]): string {
  if (rules.length === 0) return 'No reminders set.';
  const header = `  ${'PORT'.padEnd(6)} ${'EVERY'.padEnd(6)} ${'LAST'.padEnd(12)} MESSAGE`;
  const divider = '  ' + '-'.repeat(50);
  const rows = rules.map(renderReminderRow);
  return [header, divider, ...rows].join('\n');
}

export function renderDueReminder(rule: ReminderRule): string {
  return `[reminder] port ${rule.port} — ${rule.message}`;
}

export function renderReminderSummary(rules: ReminderRule[]): string {
  if (rules.length === 0) return 'No reminders configured.';
  return `${rules.length} reminder${rules.length === 1 ? '' : 's'} active.`;
}
