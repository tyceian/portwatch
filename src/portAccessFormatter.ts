import type { AccessRule } from './portAccess';
import { colorize } from './formatter';

export function formatAccessMode(mode: 'allow' | 'deny'): string {
  return mode === 'allow'
    ? colorize('green', 'ALLOW')
    : colorize('red', 'DENY');
}

export function formatAccessInline(rule: AccessRule): string {
  const badge = formatAccessMode(rule.mode);
  const reason = rule.reason ? ` — ${rule.reason}` : '';
  return `port ${rule.port}: ${badge}${reason}`;
}

export function renderAccessRow(rule: AccessRule): string {
  const port = String(rule.port).padEnd(8);
  const mode = formatAccessMode(rule.mode).padEnd(10);
  const reason = (rule.reason ?? '—').padEnd(30);
  const date = new Date(rule.createdAt).toISOString().slice(0, 10);
  return `${port}${mode}${reason}${date}`;
}

export function renderAccessTable(rules: AccessRule[]): string {
  if (rules.length === 0) return 'No access rules defined.';
  const header = 'PORT    MODE      REASON                        CREATED';
  const sep = '─'.repeat(header.length);
  const rows = rules.map(renderAccessRow);
  return [header, sep, ...rows].join('\n');
}

export function renderAccessSummary(allowed: number, denied: number): string {
  return [
    colorize('green', `${allowed} allowed`),
    colorize('red', `${denied} denied`),
  ].join('  ');
}
