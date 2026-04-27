import { LifecyclePhase, PortLifecycle } from './portLifecycle';

const PHASE_COLORS: Record<LifecyclePhase, string> = {
  development: '\x1b[34m',
  staging: '\x1b[33m',
  production: '\x1b[31m',
  deprecated: '\x1b[90m',
  experimental: '\x1b[35m',
};

const RESET = '\x1b[0m';

export function formatPhaseBadge(phase: LifecyclePhase): string {
  const color = PHASE_COLORS[phase] ?? '';
  return `${color}[${phase.toUpperCase()}]${RESET}`;
}

export function formatLifecycleInline(lc: PortLifecycle): string {
  const badge = formatPhaseBadge(lc.phase);
  const note = lc.note ? ` — ${lc.note}` : '';
  return `${badge}${note}`;
}

export function renderLifecycleRow(port: number, lc: PortLifecycle): string {
  const portCol = String(port).padEnd(8);
  const phaseCol = lc.phase.padEnd(14);
  const note = lc.note ?? '';
  return `${portCol}${phaseCol}${note}`;
}

export function renderLifecycleTable(entries: Array<{ port: number; lc: PortLifecycle }>): string {
  if (entries.length === 0) return 'No lifecycle phases set.';
  const header = 'PORT    PHASE         NOTE';
  const divider = '─'.repeat(50);
  const rows = entries.map(({ port, lc }) => renderLifecycleRow(port, lc));
  return [header, divider, ...rows].join('\n');
}

export function renderLifecycleSummary(entries: Array<{ port: number; lc: PortLifecycle }>): string {
  const counts: Partial<Record<LifecyclePhase, number>> = {};
  for (const { lc } of entries) {
    counts[lc.phase] = (counts[lc.phase] ?? 0) + 1;
  }
  const parts = Object.entries(counts).map(
    ([phase, count]) => `${formatPhaseBadge(phase as LifecyclePhase)} ×${count}`
  );
  return parts.length ? parts.join('  ') : 'No lifecycle data.';
}
