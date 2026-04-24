import { PortHealth, HealthStatus } from './portHealth';
import { colorize } from './formatter';

const STATUS_COLOR: Record<HealthStatus, string> = {
  healthy:  'green',
  warning:  'yellow',
  critical: 'red',
  unknown:  'gray',
};

const STATUS_ICON: Record<HealthStatus, string> = {
  healthy:  '✔',
  warning:  '⚠',
  critical: '✖',
  unknown:  '?',
};

export function renderHealthBadge(health: PortHealth): string {
  const color = STATUS_COLOR[health.status];
  const icon = STATUS_ICON[health.status];
  return colorize(`${icon} ${health.status.toUpperCase()} (${health.score})`, color);
}

export function renderHealthRow(health: PortHealth): string {
  const badge = renderHealthBadge(health);
  const reasons = health.reasons.length > 0
    ? `  — ${health.reasons.join('; ')}`
    : '';
  return `  Port ${health.port}: ${badge}${reasons}`;
}

export function renderHealthTable(healths: PortHealth[]): string {
  if (healths.length === 0) return 'No health data available.';

  const sorted = [...healths].sort((a, b) => a.score - b.score);
  const lines: string[] = [
    colorize('Port Health Report', 'bold'),
    '─'.repeat(50),
    ...sorted.map(renderHealthRow),
    '─'.repeat(50),
  ];

  const counts = { healthy: 0, warning: 0, critical: 0, unknown: 0 };
  for (const h of healths) counts[h.status]++;

  lines.push(
    `Summary: ${colorize(String(counts.healthy), 'green')} healthy, ` +
    `${colorize(String(counts.warning), 'yellow')} warning, ` +
    `${colorize(String(counts.critical), 'red')} critical`
  );

  return lines.join('\n');
}

export function renderHealthSummaryLine(healths: PortHealth[]): string {
  const critical = healths.filter(h => h.status === 'critical');
  const warnings = healths.filter(h => h.status === 'warning');
  if (critical.length > 0) {
    return colorize(`${critical.length} port(s) in critical health`, 'red');
  }
  if (warnings.length > 0) {
    return colorize(`${warnings.length} port(s) need attention`, 'yellow');
  }
  return colorize('All ports healthy', 'green');
}
