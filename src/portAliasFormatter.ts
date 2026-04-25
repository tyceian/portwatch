// portAliasFormatter.ts — render port alias data for CLI output

import { PortAlias } from './portAlias';

const COL_PORT = 8;
const COL_ALIAS = 20;
const COL_DESC = 36;

export function formatAliasInline(alias: PortAlias): string {
  const desc = alias.description ? ` — ${alias.description}` : '';
  return `${alias.alias} (port ${alias.port})${desc}`;
}

export function renderAliasRow(alias: PortAlias): string {
  const port = String(alias.port).padEnd(COL_PORT);
  const name = alias.alias.padEnd(COL_ALIAS);
  const desc = (alias.description ?? '—').padEnd(COL_DESC);
  return `  ${port}${name}${desc}`;
}

export function renderAliasTable(aliases: PortAlias[]): string {
  if (aliases.length === 0) return '  (no aliases defined)';
  const header = [
    'PORT'.padEnd(COL_PORT),
    'ALIAS'.padEnd(COL_ALIAS),
    'DESCRIPTION'.padEnd(COL_DESC),
  ].join('');
  const divider = '-'.repeat(COL_PORT + COL_ALIAS + COL_DESC + 2);
  const rows = aliases.map(renderAliasRow);
  return [`  ${header}`, `  ${divider}`, ...rows].join('\n');
}

export function renderAliasSummary(aliases: PortAlias[]): string {
  if (aliases.length === 0) return 'No aliases defined.';
  const total = aliases.length;
  const examples = aliases
    .slice(0, 3)
    .map(a => `${a.alias}:${a.port}`)
    .join(', ');
  const suffix = total > 3 ? ` (+${total - 3} more)` : '';
  return `${total} alias${total !== 1 ? 'es' : ''}: ${examples}${suffix}`;
}
