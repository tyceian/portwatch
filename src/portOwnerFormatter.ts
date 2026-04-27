// portOwnerFormatter.ts — render owner rules for CLI display

import { OwnerRule } from './portOwner';

const COL_PORT = 6;
const COL_OWNER = 16;
const COL_TEAM = 14;
const COL_CONTACT = 22;

export function formatOwnerInline(rule: OwnerRule): string {
  const parts = [`owner=${rule.owner}`];
  if (rule.team) parts.push(`team=${rule.team}`);
  if (rule.contact) parts.push(`contact=${rule.contact}`);
  return parts.join(' ');
}

export function renderOwnerRow(rule: OwnerRule): string {
  const port = String(rule.port).padEnd(COL_PORT);
  const owner = rule.owner.padEnd(COL_OWNER);
  const team = (rule.team ?? '—').padEnd(COL_TEAM);
  const contact = (rule.contact ?? '—').padEnd(COL_CONTACT);
  return `${port}${owner}${team}${contact}`;
}

export function renderOwnerTable(rules: OwnerRule[]): string {
  if (rules.length === 0) return 'No owner assignments found.';

  const header =
    'PORT  '.padEnd(COL_PORT) +
    'OWNER'.padEnd(COL_OWNER) +
    'TEAM'.padEnd(COL_TEAM) +
    'CONTACT'.padEnd(COL_CONTACT);
  const divider = '─'.repeat(
    COL_PORT + COL_OWNER + COL_TEAM + COL_CONTACT
  );
  const rows = rules.map(renderOwnerRow);
  return [header, divider, ...rows].join('\n');
}

export function renderOwnerSummary(rules: OwnerRule[]): string {
  const teams = new Set(rules.map((r) => r.team).filter(Boolean));
  return (
    `${rules.length} port(s) assigned` +
    (teams.size > 0 ? `, ${teams.size} team(s): ${[...teams].join(', ')}` : '')
  );
}
