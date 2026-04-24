import { PortDependency } from './portDependency';
import { colorize } from './formatter';

export function formatDependencyInline(dep: PortDependency): string {
  const label = dep.label ? ` (${dep.label})` : '';
  return `${colorize(String(dep.from), 'cyan')} → ${colorize(String(dep.to), 'green')}${label}`;
}

export function renderDependencyRow(dep: PortDependency): string {
  const label = dep.label ?? '-';
  return `  ${String(dep.from).padEnd(8)} ${String(dep.to).padEnd(8)} ${label}`;
}

export function renderDependencyTable(deps: PortDependency[]): string {
  if (deps.length === 0) return colorize('No dependencies defined.', 'dim');
  const header = `  ${'FROM'.padEnd(8)} ${'TO'.padEnd(8)} LABEL`;
  const divider = '  ' + '-'.repeat(36);
  const rows = deps.map(renderDependencyRow);
  return [header, divider, ...rows].join('\n');
}

export function renderAffectedWarning(closedPort: number, affected: number[]): string {
  if (affected.length === 0) return '';
  const ports = affected.map(p => colorize(String(p), 'yellow')).join(', ');
  return colorize(`⚠ Port ${closedPort} closed — may affect: ${ports}`, 'yellow');
}

export function renderDependencySummary(deps: PortDependency[]): string {
  const count = deps.length;
  const unique = new Set([...deps.map(d => d.from), ...deps.map(d => d.to)]).size;
  return colorize(`${count} dependenc${count === 1 ? 'y' : 'ies'} across ${unique} port${unique === 1 ? '' : 's'}`, 'dim');
}
