import { setNote, getNote, removeNote, listNotes, clearNotes } from './portNote';
import { renderNoteTable } from './portNoteFormatter';
import { colorize } from './formatter';

export function handleSetNote(port: number, text: string): void {
  if (!text || text.trim().length === 0) {
    console.error(colorize('red', 'Note text cannot be empty.'));
    return;
  }
  const note = setNote(port, text.trim());
  console.log(
    colorize('green', `✔ Note set for port ${port}:`) + ` ${note.note}`
  );
}

export function handleGetNote(port: number): void {
  const note = getNote(port);
  if (!note) {
    console.log(colorize('dim', `No note for port ${port}.`));
    return;
  }
  console.log(`Port ${colorize('cyan', String(port))}: ${note.note}`);
  console.log(colorize('dim', `  Last updated: ${note.updatedAt}`));
}

export function handleRemoveNote(port: number): void {
  const removed = removeNote(port);
  if (!removed) {
    console.log(colorize('dim', `No note found for port ${port}.`));
    return;
  }
  console.log(colorize('yellow', `Note removed for port ${port}.`));
}

export function handleListNotes(): void {
  console.log(renderNoteTable());
}

export function handleClearNotes(): void {
  const count = listNotes().length;
  clearNotes();
  console.log(colorize('yellow', `Cleared ${count} note${count === 1 ? '' : 's'}.`));
}
