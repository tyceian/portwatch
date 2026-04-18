import { Alert } from './alerts';

export type OutputFormat = 'text' | 'json' | 'compact';

export interface FormatOptions {
  format: OutputFormat;
  color: boolean;
  timestamp: boolean;
}

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function colorize(text: string, color: keyof typeof COLORS, enabled: boolean): string {
  if (!enabled) return text;
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function formatAlertText(alert: Alert, opts: FormatOptions): string {
  const prefix = alert.type === 'open'
    ? colorize('OPEN ', 'green', opts.color)
    : colorize('CLOSE', 'red', opts.color);

  const port = colorize(String(alert.port), 'bold', opts.color);
  const proc = colorize(alert.process ?? 'unknown', 'cyan', opts.color);
  const ts = opts.timestamp ? `[${formatTimestamp(alert.timestamp)}] ` : '';

  if (opts.format === 'compact') {
    return `${ts}${prefix} :${port}`;
  }

  return `${ts}${prefix} port ${port} — ${proc} (pid ${alert.pid ?? '?'})`;
}

export function formatAlertJson(alert: Alert): string {
  return JSON.stringify({
    type: alert.type,
    port: alert.port,
    process: alert.process ?? null,
    pid: alert.pid ?? null,
    timestamp: alert.timestamp.toISOString(),
  });
}

export function renderAlert(alert: Alert, opts: FormatOptions): string {
  if (opts.format === 'json') {
    return formatAlertJson(alert);
  }
  return formatAlertText(alert, opts);
}
