import { PortAlertResult, AlertSeverity } from './portAlert';
import { colorize } from './formatter';

const SEVERITY_COLORS: Record<AlertSeverity, (s: string) => string> = {
  info: (s) => colorize('cyan', s),
  warning: (s) => colorize('yellow', s),
  critical: (s) => colorize('red', s),
};

const SEVERITY_ICONS: Record<AlertSeverity, string> = {
  info: 'ℹ',
  warning: '⚠',
  critical: '✖',
};

export function formatPortAlert(alert: PortAlertResult): string {
  const color = SEVERITY_COLORS[alert.severity];
  const icon = SEVERITY_ICONS[alert.severity];
  const time = new Date(alert.triggeredAt).toLocaleTimeString();
  return `${color(`${icon} [${alert.severity.toUpperCase()}]`)} ${alert.message} ${colorize('gray', `(${alert.rule} @ ${time})`})`;
}

export function renderPortAlertList(alerts: PortAlertResult[]): string {
  if (alerts.length === 0) return colorize('green', '✔ No alerts triggered.');
  return alerts.map(formatPortAlert).join('\n');
}

export function renderPortAlertTable(alerts: PortAlertResult[]): string {
  if (alerts.length === 0) return colorize('green', '✔ No alerts triggered.');
  const header = ['PORT', 'SEVERITY', 'RULE', 'MESSAGE'].map((h) => colorize('bold', h));
  const rows = alerts.map((a) => [
    String(a.port),
    SEVERITY_COLORS[a.severity](a.severity),
    a.rule,
    a.message,
  ]);
  const cols = [header, ...rows];
  const widths = [0, 1, 2, 3].map((i) =>
    Math.max(...cols.map((r) => r[i].replace(/\x1b\[[0-9;]*m/g, '').length))
  );
  const fmt = (row: string[]) =>
    row.map((cell, i) => cell.padEnd(widths[i] + 2)).join('');
  return [fmt(header), ...rows.map(fmt)].join('\n');
}
