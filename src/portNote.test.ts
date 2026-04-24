import {
  setNote,
  getNote,
  removeNote,
  listNotes,
  hasNote,
  clearNotes,
  exportNotes,
  importNotes,
} from './portNote';

beforeEach(() => clearNotes());

test('setNote creates a new note', () => {
  const n = setNote(3000, 'dev server');
  expect(n.port).toBe(3000);
  expect(n.note).toBe('dev server');
  expect(n.createdAt).toBe(n.updatedAt);
});

test('setNote updates existing note preserving createdAt', () => {
  const first = setNote(3000, 'original');
  const second = setNote(3000, 'updated');
  expect(second.createdAt).toBe(first.createdAt);
  expect(second.note).toBe('updated');
});

test('getNote returns undefined for unknown port', () => {
  expect(getNote(9999)).toBeUndefined();
});

test('getNote returns note after set', () => {
  setNote(8080, 'proxy');
  expect(getNote(8080)?.note).toBe('proxy');
});

test('removeNote returns false for missing port', () => {
  expect(removeNote(1234)).toBe(false);
});

test('removeNote deletes note', () => {
  setNote(5000, 'api');
  expect(removeNote(5000)).toBe(true);
  expect(hasNote(5000)).toBe(false);
});

test('listNotes returns sorted by port', () => {
  setNote(9000, 'c');
  setNote(3000, 'a');
  setNote(5000, 'b');
  const ports = listNotes().map((n) => n.port);
  expect(ports).toEqual([3000, 5000, 9000]);
});

test('exportNotes and importNotes round-trip', () => {
  setNote(3000, 'hello');
  const exported = exportNotes();
  clearNotes();
  importNotes(exported);
  expect(getNote(3000)?.note).toBe('hello');
});
