// portMuteFormatter.ts — render mute rules for CLI output

import { MuteRule } from './portMute';

function formatMutedAt(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}

export function formatMuteInline(rule: MuteRule): string {
  const reason = rule.reason ? ` (${rule.reason})` : '';
  return `port ${rule.port}${reason} — muted at ${formatMutedAt(rule.mutedAt)}`;
}

export function renderMuteRow(rule: MuteRule): string {
  const port = String(rule.port).padEnd(6);
  const since = formatMutedAt(rule.mutedAt).padEnd(12);
  const reason = rule.reason ?? '—';
  return `  ${port} ${since} ${reason}`;
}

export function renderMuteTable(rules: MuteRule[]): string {
  if (rules.length === 0) return '  (no muted ports)';
  const header = '  PORT   MUTED AT     REASON';
  const divider = '  ' + '-'.repeat(40);
  const rows = rules.map(renderMuteRow);
  return [header, divider, ...rows].join('\n');
}

export function renderMuteSummary(rules: MuteRule[]): string {
  if (rules.length === 0) return 'No ports are currently muted.';
  const ports = rules.map((r) => r.port).join(', ');
  return `${rules.length} muted port(s): ${ports}`;
}
