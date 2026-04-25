import { PortMetrics } from './portMetrics';
import { colorize } from './formatter';

function fmtPct(pct: number): string {
  if (pct >= 95) return colorize('green', `${pct.toFixed(1)}%`);
  if (pct >= 75) return colorize('yellow', `${pct.toFixed(1)}%`);
  return colorize('red', `${pct.toFixed(1)}%`);
}

function fmtMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

export function formatMetricsInline(m: PortMetrics): string {
  return `port ${m.port}: up ${fmtMs(m.totalUptime)}, opens=${m.openCount}, closes=${m.closeCount}, avail=${fmtPct(m.availabilityPct)}`;
}

export function renderMetricsRow(m: PortMetrics): string {
  const port = String(m.port).padEnd(6);
  const opens = String(m.openCount).padEnd(7);
  const closes = String(m.closeCount).padEnd(8);
  const uptime = fmtMs(m.totalUptime).padEnd(10);
  const avail = fmtPct(m.availabilityPct);
  return `  ${port} ${opens} ${closes} ${uptime} ${avail}`;
}

export function renderMetricsTable(metrics: PortMetrics[]): string {
  if (metrics.length === 0) return colorize('dim', '  no metrics recorded yet');
  const header = `  ${'PORT'.padEnd(6)} ${'OPENS'.padEnd(7)} ${'CLOSES'.padEnd(8)} ${'UPTIME'.padEnd(10)} AVAIL`;
  const sep = '  ' + '-'.repeat(44);
  const rows = metrics.map(renderMetricsRow);
  return [header, sep, ...rows].join('\n');
}

export function renderMetricsSummary(metrics: PortMetrics[]): string {
  if (metrics.length === 0) return colorize('dim', 'no metrics');
  const avg = metrics.reduce((s, m) => s + m.availabilityPct, 0) / metrics.length;
  return `${metrics.length} port(s) tracked, avg availability: ${fmtPct(avg)}`;
}
