// portSilenceFormatter.ts — render silence rules for CLI output

import { SilenceRule } from './portSilence';
import { colorize } from './formatter';
import { getLabelForPort } from './portLabel';

const PERMANENT_LABEL = 'permanent';

function formatUntil(until: number): string {
  if (until === 0) return colorize('yellow', PERMANENT_LABEL);
  const remaining = until - Date.now();
  if (remaining <= 0) return colorize('gray', 'expired');
  const secs = Math.floor(remaining / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ${secs % 60}s`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function formatSilenceRow(rule: SilenceRule): string {
  const label = getLabelForPort(rule.port);
  const portStr = colorize('cyan', String(rule.port));
  const labelStr = label ? colorize('gray', `(${label})`) : '';
  const timeStr = formatUntil(rule.until);
  const reasonStr = rule.reason ? colorize('gray', `— ${rule.reason}`) : '';
  return `  ${portStr} ${labelStr}  expires: ${timeStr}  ${reasonStr}`.trimEnd();
}

export function renderSilenceList(rules: SilenceRule[]): string {
  if (rules.length === 0) {
    return colorize('gray', 'No ports are currently silenced.');
  }
  const header = colorize('bold', `Silenced ports (${rules.length}):`);
  const rows = rules.map(formatSilenceRow).join('\n');
  return `${header}\n${rows}`;
}

export function renderSilenceTable(rules: SilenceRule[]): string {
  if (rules.length === 0) return colorize('gray', 'No silenced ports.');
  const header = ['PORT', 'LABEL', 'EXPIRES', 'REASON']
    .map(h => colorize('bold', h.padEnd(14)))
    .join('');
  const rows = rules.map(r => {
    const label = getLabelForPort(r.port) ?? '';
    return [
      String(r.port).padEnd(14),
      label.padEnd(14),
      formatUntil(r.until).padEnd(14),
      r.reason ?? '',
    ].join('');
  });
  return [header, ...rows].join('\n');
}
