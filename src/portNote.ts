// Per-port developer notes/annotations

export interface PortNote {
  port: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

type NoteStore = Record<number, PortNote>;

let notes: NoteStore = {};

export function setNote(port: number, text: string): PortNote {
  const now = new Date().toISOString();
  const existing = notes[port];
  const note: PortNote = {
    port,
    note: text,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  notes[port] = note;
  return note;
}

export function getNote(port: number): PortNote | undefined {
  return notes[port];
}

export function removeNote(port: number): boolean {
  if (!notes[port]) return false;
  delete notes[port];
  return true;
}

export function listNotes(): PortNote[] {
  return Object.values(notes).sort((a, b) => a.port - b.port);
}

export function hasNote(port: number): boolean {
  return port in notes;
}

export function clearNotes(): void {
  notes = {};
}

export function importNotes(store: NoteStore): void {
  notes = { ...store };
}

export function exportNotes(): NoteStore {
  return { ...notes };
}
