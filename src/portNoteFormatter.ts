import { PortNote, listNotes } from './portNote';
import { colorize } from './formatter';

export function formatNoteRow(note: PortNote): string {
  const port = colorize('cyan', String(note.port).padEnd(6));
  const text = note.note.length > 60 ? note.note.slice(0, 57) + '...' : note.note.padEnd(60);
  const updated = note.updatedAt.slice(0, 10);
  return `${port}  ${text}  ${colorize('dim', updated)}`;
}

export function renderNoteTable(): string {
  const all = listNotes();
  if (all.length === 0) {
    return colorize('dim', 'No notes recorded.');
  }
  const header =
    colorize('bold', 'PORT  ') +
    '  ' +
    colorize('bold', 'NOTE'.padEnd(60)) +
    '  ' +
    colorize('bold', 'UPDATED');
  const divider = '-'.repeat(80);
  const rows = all.map(formatNoteRow).join('\n');
  return [header, divider, rows].join('\n');
}

export function renderNoteInline(port: number, note: PortNote | undefined): string {
  if (!note) return '';
  return colorize('yellow', ` [note: ${note.note}]`);
}

export function renderNoteSummary(): string {
  const count = listNotes().length;
  if (count === 0) return '';
  return colorize('dim', `${count} port note${count === 1 ? '' : 's'} recorded`);
}
