import { ExportData } from './portExport';

export function renderExportSummary(data: ExportData): string {
  const lines: string[] = [];
  lines.push(`Export Summary`);
  lines.push(`  Exported at : ${data.exportedAt}`);
  lines.push(`  Version     : ${data.version}`);
  lines.push(`  Events      : ${data.history.length}`);
  lines.push(`  Ports tracked : ${Object.keys(data.stats).length}`);
  lines.push(`  Watch rules : ${data.watchRules.length}`);
  lines.push(`  Silenced    : ${data.silenced.length}`);
  const tagCount = Object.values(data.tags).reduce((s, t) => s + t.length, 0);
  lines.push(`  Tags        : ${tagCount}`);
  const noteCount = Object.keys(data.notes).length;
  lines.push(`  Notes       : ${noteCount}`);
  return lines.join('\n');
}

export function renderExportRow(port: number, data: ExportData): string {
  const events = data.history.filter((e) => e.port === port).length;
  const tags = (data.tags[port] ?? []).join(', ') || '—';
  const note = data.notes[port] ?? '—';
  const silenced = data.silenced.some((s) => s.port === port) ? 'yes' : 'no';
  return `port=${port} events=${events} tags=[${tags}] note="${note}" silenced=${silenced}`;
}

export function renderImportWarnings(data: ExportData): string[] {
  const warnings: string[] = [];
  if (data.history.length === 0) {
    warnings.push('Imported export contains no history events.');
  }
  if (data.watchRules.length === 0) {
    warnings.push('No watch rules found in import.');
  }
  const staleRules = data.silenced.filter((s) => {
    if (!s.until) return false;
    return new Date(s.until).getTime() < Date.now();
  });
  if (staleRules.length > 0) {
    warnings.push(`${staleRules.length} silence rule(s) have already expired.`);
  }
  return warnings;
}
