import { BookmarkRule } from './portBookmark';

const COLORS: Record<string, string> = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};
const RESET = '\x1b[0m';

function applyColor(text: string, color?: string): string {
  if (!color || !COLORS[color]) return text;
  return `${COLORS[color]}${text}${RESET}`;
}

export function formatBookmarkInline(rule: BookmarkRule): string {
  const tag = applyColor(`[${rule.label}]`, rule.color);
  return `${tag} :${rule.port}`;
}

export function renderBookmarkRow(rule: BookmarkRule): string {
  const portCol = String(rule.port).padEnd(8);
  const labelCol = applyColor(rule.label.padEnd(20), rule.color);
  const date = new Date(rule.createdAt).toLocaleDateString();
  return `${portCol}${labelCol}${date}`;
}

export function renderBookmarkTable(rules: BookmarkRule[]): string {
  if (rules.length === 0) return 'No bookmarks saved.';
  const header = 'PORT    LABEL               CREATED';
  const divider = '-'.repeat(header.length);
  const rows = rules.map(renderBookmarkRow);
  return [header, divider, ...rows].join('\n');
}

export function renderBookmarkSummary(rules: BookmarkRule[]): string {
  if (rules.length === 0) return 'No bookmarks.';
  const items = rules.map((r) => formatBookmarkInline(r)).join(', ');
  return `Bookmarks (${rules.length}): ${items}`;
}
