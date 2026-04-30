import { PortComment } from './portComment';

const COL_PORT = 6;
const COL_AUTHOR = 12;
const COL_TEXT = 40;
const COL_UPDATED = 20;

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString();
}

export function formatCommentInline(comment: PortComment): string {
  const author = comment.author ? ` [${comment.author}]` : '';
  return `port ${comment.port}${author}: ${comment.text}`;
}

export function renderCommentRow(comment: PortComment): string {
  const port = String(comment.port).padEnd(COL_PORT);
  const author = (comment.author ?? '—').padEnd(COL_AUTHOR);
  const text = comment.text.slice(0, COL_TEXT - 1).padEnd(COL_TEXT);
  const updated = fmtDate(comment.updatedAt).padEnd(COL_UPDATED);
  return `${port}  ${author}  ${text}  ${updated}`;
}

export function renderCommentTable(comments: PortComment[]): string {
  if (comments.length === 0) return 'No comments.';
  const header =
    'PORT'.padEnd(COL_PORT) +
    '  ' +
    'AUTHOR'.padEnd(COL_AUTHOR) +
    '  ' +
    'COMMENT'.padEnd(COL_TEXT) +
    '  ' +
    'UPDATED'.padEnd(COL_UPDATED);
  const divider = '-'.repeat(header.length);
  const rows = comments.map(renderCommentRow);
  return [header, divider, ...rows].join('\n');
}

export function renderCommentSummary(comments: PortComment[]): string {
  if (comments.length === 0) return 'No port comments recorded.';
  return `${comments.length} port comment${comments.length === 1 ? '' : 's'} recorded.`;
}
