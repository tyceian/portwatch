import type { VersionRecord } from './portVersion';

const COL_PORT = 8;
const COL_VERSION = 14;
const COL_UPDATED = 22;

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function fmtUpdated(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function formatVersionInline(record: VersionRecord): string {
  return `port ${record.port} @ v${record.version}`;
}

export function renderVersionRow(record: VersionRecord): string {
  const port = pad(String(record.port), COL_PORT);
  const ver = pad(record.version, COL_VERSION);
  const updated = pad(fmtUpdated(record.updatedAt), COL_UPDATED);
  return `${port}${ver}${updated}`;
}

export function renderVersionTable(records: VersionRecord[]): string {
  if (records.length === 0) return 'No version records found.';

  const header =
    pad('PORT', COL_PORT) +
    pad('VERSION', COL_VERSION) +
    pad('UPDATED', COL_UPDATED);
  const divider = '-'.repeat(COL_PORT + COL_VERSION + COL_UPDATED);

  const rows = records
    .slice()
    .sort((a, b) => a.port - b.port)
    .map(renderVersionRow);

  return [header, divider, ...rows].join('\n');
}

export function renderVersionSummary(records: VersionRecord[]): string {
  if (records.length === 0) return 'No versioned ports.';
  const lines = records
    .slice()
    .sort((a, b) => a.port - b.port)
    .map(r => `  ${formatVersionInline(r)}`);
  return `Versioned ports (${records.length}):\n${lines.join('\n')}`;
}
