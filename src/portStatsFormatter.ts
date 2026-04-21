import { PortStats, StatsMap, getTopPorts } from './portStats';
import { colorize } from './formatter';
import { getLabelForPort } from './portLabel';

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatPortStatsRow(s: PortStats): string {
  const label = getLabelForPort(s.port);
  const portStr = label
    ? colorize(`${s.port}`, 'cyan') + colorize(` (${label})`, 'gray')
    : colorize(`${s.port}`, 'cyan');
  const opens = colorize(`${s.openCount}`, 'green');
  const closes = colorize(`${s.closeCount}`, 'yellow');
  const uptime = s.totalUptime > 0 ? fmtDuration(s.totalUptime) : '-';
  const avg = s.avgSessionMs > 0 ? fmtDuration(s.avgSessionMs) : '-';
  return `  :${portStr.padEnd(24)} opens: ${opens.padEnd(6)} closes: ${closes.padEnd(6)} uptime: ${uptime.padEnd(10)} avg: ${avg}`;
}

export function renderStatsTable(statsMap: StatsMap): string {
  const entries = Object.values(statsMap).sort((a, b) => a.port - b.port);
  if (entries.length === 0) return colorize('No port activity recorded.', 'gray');
  const header = colorize('Port Activity Stats\n', 'bold');
  const rows = entries.map(formatPortStatsRow).join('\n');
  return header + rows;
}

export function renderTopPorts(statsMap: StatsMap, limit = 5): string {
  const top = getTopPorts(statsMap, limit);
  if (top.length === 0) return colorize('No data.', 'gray');
  const header = colorize(`Top ${limit} Most Active Ports\n`, 'bold');
  const rows = top.map((s, i) => {
    const rank = colorize(`${i + 1}.`, 'magenta');
    return `  ${rank} ${formatPortStatsRow(s)}`;
  }).join('\n');
  return header + rows;
}
