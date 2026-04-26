// portEnvironmentFormatter.ts — rendering helpers for environment rules

import { EnvironmentRule, getKnownEnvironments } from './portEnvironment';

const ENV_COLORS: Record<string, string> = {
  prod: '\x1b[31m',
  production: '\x1b[31m',
  staging: '\x1b[33m',
  dev: '\x1b[32m',
  development: '\x1b[32m',
  local: '\x1b[36m',
  test: '\x1b[35m',
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

export function colorizeEnv(env: string): string {
  const color = ENV_COLORS[env.toLowerCase()] ?? '\x1b[37m';
  return `${color}${env}${RESET}`;
}

export function formatEnvironmentInline(rule: EnvironmentRule): string {
  return `port ${BOLD}${rule.port}${RESET} → ${colorizeEnv(rule.environment)}`;
}

export function renderEnvironmentRow(rule: EnvironmentRule): string {
  const portCol = String(rule.port).padEnd(8);
  const envCol = colorizeEnv(rule.environment).padEnd(20);
  const date = new Date(rule.addedAt).toISOString().slice(0, 10);
  return `  ${portCol}${envCol}${DIM}${date}${RESET}`;
}

export function renderEnvironmentTable(rules: EnvironmentRule[]): string {
  if (rules.length === 0) return `${DIM}No environment assignments.${RESET}`;
  const header = `  ${'PORT'.padEnd(8)}${'ENVIRONMENT'.padEnd(20)}ADDED`;
  const divider = '  ' + '-'.repeat(40);
  const rows = rules.map(renderEnvironmentRow);
  return [header, divider, ...rows].join('\n');
}

export function renderEnvironmentSummary(rules: EnvironmentRule[]): string {
  if (rules.length === 0) return `${DIM}No environments assigned.${RESET}`;
  const counts: Record<string, number> = {};
  for (const r of rules) counts[r.environment] = (counts[r.environment] ?? 0) + 1;
  const parts = Object.entries(counts).map(([env, n]) => `${colorizeEnv(env)}: ${n}`);
  return `Environments — ${parts.join('  ')}`;
}

export function renderKnownEnvironments(): string {
  return `Known: ${getKnownEnvironments().map(colorizeEnv).join(', ')}`;
}
