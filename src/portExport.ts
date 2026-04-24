import { PortEvent } from './history';
import { PortStats } from './portStats';
import { PortHealthScore } from './portHealth';
import { SilenceRule } from './portSilence';
import { WatchRule } from './portWatch';

export interface ExportData {
  exportedAt: string;
  version: string;
  history: PortEvent[];
  stats: Record<number, PortStats>;
  health: Record<number, PortHealthScore>;
  silenced: SilenceRule[];
  watchRules: WatchRule[];
  tags: Record<number, string[]>;
  notes: Record<number, string>;
}

export function buildExport(
  history: PortEvent[],
  stats: Record<number, PortStats>,
  health: Record<number, PortHealthScore>,
  silenced: SilenceRule[],
  watchRules: WatchRule[],
  tags: Record<number, string[]>,
  notes: Record<number, string>
): ExportData {
  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    history,
    stats,
    health,
    silenced,
    watchRules,
    tags,
    notes,
  };
}

export function exportToJson(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCsv(history: PortEvent[]): string {
  const header = 'timestamp,port,type,pid,process';
  const rows = history.map((e) => {
    const ts = new Date(e.timestamp).toISOString();
    const pid = e.pid ?? '';
    const proc = e.processName ?? '';
    return `${ts},${e.port},${e.type},${pid},${proc}`;
  });
  return [header, ...rows].join('\n');
}

export function importFromJson(raw: string): ExportData {
  const parsed = JSON.parse(raw);
  if (!parsed.version || !Array.isArray(parsed.history)) {
    throw new Error('Invalid export format: missing version or history');
  }
  return parsed as ExportData;
}
