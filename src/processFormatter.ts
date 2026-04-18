import { ProcessInfo } from './process';
import { colorize } from './formatter';

export function formatProcessBadge(info: ProcessInfo | null): string {
  if (!info) return colorize('gray', '[unknown process]');
  return colorize('cyan', `[${info.name}:${info.pid}]`);
}

export function formatProcessLine(info: ProcessInfo): string {
  const badge = formatProcessBadge(info);
  const portStr = colorize('yellow', `${info.port}/${info.protocol}`);
  return `${badge} listening on ${portStr}`;
}

export function formatProcessTable(infos: ProcessInfo[]): string {
  if (!infos.length) return 'No processes found.';
  const header = ['NAME', 'PID', 'PORT', 'PROTO'].map(h => h.padEnd(12)).join('');
  const divider = '-'.repeat(48);
  const rows = infos.map(i =>
    [
      i.name.padEnd(12),
      String(i.pid).padEnd(12),
      String(i.port).padEnd(12),
      i.protocol.padEnd(12),
    ].join('')
  );
  return [header, divider, ...rows].join('\n');
}
